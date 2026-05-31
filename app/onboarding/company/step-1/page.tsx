import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSortedCountries } from "@/lib/constants/countries";
import { updateCompanyInfo } from "@/lib/actions/profile";
import Link from "next/link";

export const metadata = {
  title: "Company Info — ShipCrewFinder",
};

export default async function CompanyStep1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get company name from existing record
  const { data: companyDetails } = await supabase
    .from("company_details")
    .select("company_name")
    .eq("id", user.id)
    .single();

  const countries = getSortedCountries();

  const companyTypes = [
    { value: "shipowner", label: "Shipowner / Operator" },
    { value: "ship_management", label: "Ship Management Company" },
    { value: "crewing_agency", label: "Crewing Agency" },
    { value: "shipyard", label: "Shipyard / Repair Facility" },
    { value: "offshore", label: "Offshore / Oil & Gas" },
    { value: "cruise", label: "Cruise Line" },
    { value: "yacht", label: "Yacht / Superyacht Operator" },
    { value: "service_provider", label: "Maritime Service Provider" },
    { value: "other", label: "Other" },
  ];

  const companySizes = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-1000", label: "201-1000 employees" },
    { value: "1000+", label: "1000+ employees" },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm font-bold">Step 1 of 3</span>
          <span className="text-white/60 text-sm">33% complete</span>
        </div>
        <div className="h-2 bg-primary-dark border border-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: "33%" }} />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <div className="inline-block px-4 py-1.5 bg-accent/15 border border-accent/30 rounded-full mb-4">
          <span className="text-accent text-xs font-extrabold tracking-wider uppercase">For Companies</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Tell us about your company
        </h1>
        <p className="text-white/60 text-lg">
          {companyDetails?.company_name || "Your company"} — let's complete your profile to start finding talent.
        </p>
      </div>

      {/* Form */}
      <form action={updateCompanyInfo} className="space-y-5">
        {/* HQ Country */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="country" className="block text-white font-bold mb-3">
            Headquarters Country <span className="text-accent">*</span>
          </label>
          <select
            id="country"
            name="country"
            required
            defaultValue=""
            className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
          >
            <option value="" disabled>
              -- Select country --
            </option>
            <optgroup label="Popular Maritime Nations">
              {countries.slice(0, 14).map((country) => (
                <option key={country.code} value={country.code} className="bg-primary-dark">
                  {country.flag} {country.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="All Countries">
              {countries.slice(14).map((country) => (
                <option key={country.code} value={country.code} className="bg-primary-dark">
                  {country.flag} {country.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Company Type */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="companyType" className="block text-white font-bold mb-3">
            Company Type <span className="text-accent">*</span>
          </label>
          <select
            id="companyType"
            name="companyType"
            required
            defaultValue=""
            className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
          >
            <option value="" disabled>
              -- Select type --
            </option>
            {companyTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-primary-dark">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Company Size */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="companySize" className="block text-white font-bold mb-3">
            Company Size
          </label>
          <select
            id="companySize"
            name="companySize"
            defaultValue=""
            className="w-full px-4 py-3 bg-primary border border-white/15 rounded-lg text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23fbbf24' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
          >
            <option value="" disabled>
              -- Select size --
            </option>
            {companySizes.map((size) => (
              <option key={size.value} value={size.value} className="bg-primary-dark">
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Website */}
        <div className="bg-primary-dark border border-white/10 rounded-2xl p-6">
          <label htmlFor="website" className="block text-white font-bold mb-3">
            Company Website <span className="text-white/40 text-sm font-normal">(optional)</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="https://yourcompany.com"
            className="w-full px-4 py-3 bg-primary border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition"
          />
          <p className="text-white/40 text-xs mt-2">A website builds trust with candidates</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/dashboard" className="text-white/40 hover:text-white/60 text-sm transition">
            ← Skip for now
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg transition shadow-lg shadow-accent/20"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
