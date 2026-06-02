export const CLIENT_FILTERS = [
  { id: "worldwide", label: "Worldwide" },
  { id: "automobile", label: "Automobile" },
  { id: "cement", label: "Cement" },
  { id: "chemical", label: "Chemical" },
  { id: "pharma-fmcg", label: "Pharma & FMCG" },
  { id: "distillery-sugar", label: "Distillery & Sugar" },
  { id: "epc", label: "EPC" },
  { id: "food-beverage", label: "Food & Beverage" },
  { id: "government", label: "Government" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "om", label: "O&M" },
  { id: "oil-gas", label: "Oil & Gas" },
  { id: "paper-pulp", label: "Paper & Pulp" },
  { id: "power", label: "Power" },
  { id: "real-estate", label: "Real Estate" },
  { id: "steel", label: "Steel" },
  { id: "textile", label: "Textile" },
] as const;

export type ClientFilterId = (typeof CLIENT_FILTERS)[number]["id"];

export type CustomerIndustry = Exclude<ClientFilterId, "worldwide">;

export type Customer = {
  name: string;
  industries: CustomerIndustry[];
};

/** Customer roster — filter by industry; "worldwide" shows all. */
export const CUSTOMERS: Customer[] = [
  { name: "ABB", industries: ["power", "manufacturing", "epc"] },
  { name: "AFCONS", industries: ["epc", "government", "real-estate"] },
  { name: "Al-Quraish Group", industries: ["oil-gas", "chemical"] },
  { name: "Apollo International", industries: ["pharma-fmcg", "manufacturing"] },
  { name: "Hyflux", industries: ["government", "epc"] },
  { name: "Dangote Group", industries: ["cement", "manufacturing"] },
  { name: "Tata Group", industries: ["automobile", "steel", "power"] },
  { name: "Larsen & Toubro", industries: ["epc", "government", "power"] },
  { name: "Reliance Industries", industries: ["oil-gas", "chemical", "power"] },
  { name: "Mahindra & Mahindra", industries: ["automobile", "manufacturing"] },
  { name: "Adani Group", industries: ["power", "cement", "real-estate"] },
  { name: "JSW Steel", industries: ["steel", "manufacturing"] },
  { name: "BHEL", industries: ["power", "government"] },
  { name: "ONGC", industries: ["oil-gas", "government"] },
  { name: "Siemens", industries: ["power", "manufacturing"] },
  { name: "Ultratech Cement", industries: ["cement"] },
  { name: "ACC Limited", industries: ["cement", "manufacturing"] },
  { name: "Dr. Reddy's Laboratories", industries: ["pharma-fmcg", "chemical"] },
  { name: "ITC Limited", industries: ["pharma-fmcg", "food-beverage"] },
  { name: "United Spirits", industries: ["distillery-sugar", "food-beverage"] },
  { name: "Balrampur Chini Mills", industries: ["distillery-sugar"] },
  { name: "Thermax", industries: ["epc", "power", "om"] },
  { name: "Voltas", industries: ["epc", "real-estate"] },
  { name: "Parle Agro", industries: ["food-beverage", "manufacturing"] },
  { name: "Nestlé India", industries: ["food-beverage", "pharma-fmcg"] },
  { name: "Jal Board — Smart City", industries: ["government", "om"] },
  { name: "MIDC Pune", industries: ["government", "manufacturing"] },
  { name: "Godrej Industries", industries: ["manufacturing", "chemical"] },
  { name: "Essar Oil", industries: ["oil-gas", "chemical"] },
  { name: "JK Paper", industries: ["paper-pulp"] },
  { name: "Century Pulp & Paper", industries: ["paper-pulp", "manufacturing"] },
  { name: "NTPC", industries: ["power", "government"] },
  { name: "Tata Power", industries: ["power"] },
  { name: "DLF Limited", industries: ["real-estate", "epc"] },
  { name: "Lodha Group", industries: ["real-estate"] },
  { name: "Tata Steel", industries: ["steel"] },
  { name: "SAIL", industries: ["steel", "government"] },
  { name: "Arvind Limited", industries: ["textile", "manufacturing"] },
  { name: "Raymond", industries: ["textile"] },
  { name: "Welspun India", industries: ["textile", "manufacturing"] },
];
