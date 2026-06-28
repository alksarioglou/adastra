// Fiber AI — real company discovery matching the ICP.
import { companySearch } from "@fiberai/sdk";

// The exact industry taxonomy Fiber's industriesV2 filter accepts.
export const FIBER_INDUSTRIES = [
  "Administrative Services", "Aerospace & Military", "Artificial Intelligence",
  "Arts & Music", "Automotive", "Business Services", "Cloud", "Construction",
  "Consulting", "Consumer Goods", "Consumer Services", "Design", "Education",
  "Energy", "Entertainment", "Environmental", "Events", "Farming & Agriculture",
  "Finance", "Food & Beverage", "Gaming", "Government", "Hardware", "Healthcare",
  "Hospitality", "Industrials", "Information Technology", "Insurance", "Legal",
  "Life Sciences", "Logistics", "Manufacturing", "Marketing & Advertising",
  "Media", "Mining", "Nonprofit", "Publishing", "Real Estate", "Retail",
  "Science & Engineering", "Security", "Software", "Sports", "Telecom", "Trade",
  "Transportation", "Travel & Tourism", "Utilities", "Venture Capital",
] as const;

type FiberIndustry = (typeof FIBER_INDUSTRIES)[number];

function validIndustries(input: string[]): FiberIndustry[] {
  const set = new Set<string>(FIBER_INDUSTRIES);
  const valid = input.filter((i): i is FiberIndustry => set.has(i));
  return valid.length ? valid : ["Software"];
}

export interface FiberCompany {
  name: string;
  location: string;
  industry: string;
  headline: string;
  domain: string;
  linkedinUrl: string;
}

interface RawCompany {
  preferred_name?: string | null;
  names?: (string | null)[] | null;
  location_name?: string | null;
  li_locations?: (string | null)[] | null;
  location_consensus?: string | null;
  li_industries?: (string | null)[] | null;
  standard_industries?: (string | null)[] | null;
  li_headline?: string | null;
  short_description?: string | null;
  domains?: (string | null)[] | null;
  websites?: (string | null)[] | null;
  linkedin_primary_slug?: string | null;
  linkedin_slugs?: (string | null)[] | null;
}

function pickLinkedinUrl(c: RawCompany): string {
  const slug = c.linkedin_primary_slug || c.linkedin_slugs?.[0];
  return slug ? `https://www.linkedin.com/company/${slug}` : "";
}

function pickName(c: RawCompany): string {
  return c.preferred_name || c.names?.[0] || "";
}

function pickLocation(c: RawCompany): string {
  return (
    c.location_name ||
    c.li_locations?.[0] ||
    c.location_consensus ||
    ""
  );
}

export interface CompanySearchOpts {
  industries: string[];
  employeeMin?: number;
  employeeMax?: number;
  keywords?: string[];
  pageSize?: number;
}

/** Search companies matching the ICP. Returns [] on any failure. */
export async function searchCompanies(
  opts: CompanySearchOpts,
): Promise<FiberCompany[]> {
  if (!process.env.FIBER_API_KEY) return [];
  const { industries, employeeMin, employeeMax, keywords, pageSize = 25 } = opts;

  const searchParams: Record<string, unknown> = {
    industriesV2: { anyOf: validIndustries(industries) },
  };
  if (employeeMin != null || employeeMax != null) {
    searchParams.employeeCountV2 = {
      lowerBoundExclusive: employeeMin ?? null,
      upperBoundInclusive: employeeMax ?? null,
    };
  }
  if (keywords?.length) {
    searchParams.keywords = { containsAny: keywords };
  }

  try {
    const r = await companySearch({
      body: {
        apiKey: process.env.FIBER_API_KEY,
        searchParams,
        pageSize,
      },
    });

    const raw = (r.data?.output?.data ?? []) as RawCompany[];
    return raw
      .map((c) => ({
        name: pickName(c),
        location: pickLocation(c),
        industry: c.li_industries?.[0] || c.standard_industries?.[0] || "",
        headline: c.li_headline || c.short_description || "",
        domain: c.domains?.[0] || c.websites?.[0] || "",
        linkedinUrl: pickLinkedinUrl(c),
      }))
      .filter((c) => c.name);
  } catch (err) {
    console.error("[fiber] searchCompanies failed:", err);
    return [];
  }
}
