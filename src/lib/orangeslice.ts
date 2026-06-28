// Orange Slice — real LinkedIn decision-makers at the ICP companies.
// Uses the LinkedIn B2B database (services.company.getEmployeesFromLinkedin),
// which is a separate credit pool from web search. Degrades to [] on failure.
import { services } from "orangeslice";

export interface OsLead {
  name: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
}

interface RawEmployee {
  lp_formatted_name?: string | null;
  lp_first_name?: string | null;
  lp_last_name?: string | null;
  lp_title?: string | null;
  lp_headline?: string | null;
  lp_location_name?: string | null;
  lp_public_profile_url?: string | null;
  lp_company_name?: string | null;
}

// SQL filter (Postgres regex) selecting decision-maker titles.
const DECISION_MAKER_FILTER =
  "pos.title ~* 'Chief|President|Founder|Owner|\\mVP\\M|Vice President|Head|Director|\\mLead\\M|Manager'";

async function employeesAt(
  linkedinUrl: string,
  company: string,
  limit: number,
): Promise<OsLead[]> {
  try {
    const r = await services.company.getEmployeesFromLinkedin({
      linkedinUrl,
      titleSqlFilter: DECISION_MAKER_FILTER,
      limit,
    });
    const employees: RawEmployee[] = r?.employees ?? [];
    return employees
      .map((e) => ({
        name:
          e.lp_formatted_name ||
          [e.lp_first_name, e.lp_last_name].filter(Boolean).join(" "),
        title: e.lp_title || e.lp_headline || "",
        company: e.lp_company_name || company,
        location: e.lp_location_name || "",
        linkedinUrl: e.lp_public_profile_url || "",
      }))
      .filter((p) => p.name);
  } catch (err) {
    console.error(`[orangeslice] employeesAt(${company}) failed:`, err);
    return [];
  }
}

/**
 * Pull a few real decision-makers from each of the top companies (parallel).
 * Returns a flat list of real LinkedIn leads, or [] if OS is unavailable.
 */
export async function findDecisionMakers(
  companies: { name: string; linkedinUrl: string }[],
  perCompany = 3,
): Promise<OsLead[]> {
  const targets = companies.filter((c) => c.linkedinUrl).slice(0, 3);
  if (targets.length === 0) return [];

  const batches = await Promise.all(
    targets.map((c) => employeesAt(c.linkedinUrl, c.name, perCompany)),
  );
  return batches.flat();
}
