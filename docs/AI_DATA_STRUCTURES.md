# Data Structures and Field Types

## Understanding Composite Fields

Twenty CRM uses **composite fields** to group related data. The MCP server handles the complex GraphQL structure automatically, but you should understand what's happening behind the scenes.

### Name Composite
**What you send:**
```javascript
{ firstName: "John", lastName: "Doe" }
```

**What Twenty stores:**
```javascript
{
  name: {
    firstName: "John",
    lastName: "Doe"
  }
}
```

---

### Emails Composite
**What you send:**
```javascript
{ email: "john@example.com" }
```

**What Twenty stores:**
```javascript
{
  emails: {
    primaryEmail: "john@example.com",
    additionalEmails: []
  }
}
```

---

### Phones Composite
**What you send:**
```javascript
{
  phone: "5551234567",
  phoneCountryCode: "US",
  phoneCallingCode: "+1"
}
```

**What Twenty stores:**
```javascript
{
  phones: {
    primaryPhoneNumber: "5551234567",
    primaryPhoneCountryCode: "US",
    primaryPhoneCallingCode: "+1",
    additionalPhones: []
  }
}
```

---

### Address Composite
**What you send:**
```javascript
{
  addressStreet1: "123 Main St",
  addressStreet2: "Suite 100",
  addressCity: "San Francisco",
  addressPostcode: "94102",
  addressState: "CA",
  addressCountry: "United States"
}
```

**What Twenty stores:**
```javascript
{
  address: {
    addressStreet1: "123 Main St",
    addressStreet2: "Suite 100",
    addressCity: "San Francisco",
    addressPostcode: "94102",
    addressState: "CA",
    addressCountry: "United States"
  }
}
```

---

### Currency Composite (ARR and Opportunity Amount)
**What you send:**
```javascript
{
  annualRecurringRevenue: 5000000,  // $5M in standard units
  currency: "USD"
}
```

**What Twenty stores (micros):**
```javascript
{
  annualRecurringRevenue: {
    amountMicros: 5000000000000,  // $5M * 1,000,000
    currencyCode: "USD"
  }
}
```

**Important:** The MCP server automatically converts between standard units and micros. Always use standard currency values (5000000 for $5M, not 5000000000000).

---

### Link Composites (LinkedIn, X/Twitter, Domain)
**What you send:**
```javascript
{
  linkedinUrl: "https://linkedin.com/in/johndoe",
  xUrl: "https://twitter.com/johndoe"
}
```

**What Twenty stores:**
```javascript
{
  linkedinLink: {
    primaryLinkUrl: "https://linkedin.com/in/johndoe",
    secondaryLinks: []
  },
  xLink: {
    primaryLinkUrl: "https://twitter.com/johndoe",
    secondaryLinks: []
  }
}
```

---

### BodyV2 Composite (Rich Text for Tasks and Notes)
**What you send:**
```javascript
{
  body: "# Meeting Notes\n\nDiscussed pricing and timeline."
}
```

**What Twenty stores:**
```javascript
{
  bodyV2: {
    markdown: "# Meeting Notes\n\nDiscussed pricing and timeline.",
    blocknote: "[{\"type\":\"paragraph\",\"content\":[...]}]"
  }
}
```

**Usage:**
- Used for `body` fields in tasks and notes
- Supports full markdown formatting
- Automatically converted to Twenty's BlockNote rich text format
- Always provide plain text or markdown in the `body` parameter

---

## Field Validation Rules

### Email Format
- Must be valid email format: `user@domain.com`
- Case-insensitive
- No spaces allowed

### Phone Numbers
- Digits only for `phone` field (no dashes, spaces, parentheses)
- Use `phoneCallingCode` for international prefix (e.g., "+1", "+49")
- Use `phoneCountryCode` for ISO country code (e.g., "US", "DE", "GB")

### Currency
- Supported codes: "USD", "EUR", "GBP", "JPY", "CAD", "AUD", etc.
- Always uppercase
- Defaults to "USD" if not specified

### Dates
- ISO 8601 format required
- Dates: "YYYY-MM-DD" (e.g., "2025-12-31")
- Datetimes: "YYYY-MM-DDTHH:MM:SSZ" (e.g., "2025-11-20T14:30:00Z")
- Always use UTC timezone (Z suffix)

### IDs (UUIDs)
- Format: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
- Always lowercase
- Required for get/update operations
- Returned from create operations

### Opportunity Stages
Valid values: `NEW`, `SCREENING`, `MEETING`, `PROPOSAL`, `CUSTOMER`

### Task Statuses
Valid values: `TODO`, `IN_PROGRESS`, `DONE`

### Attachment File Categories
Valid values: `ARCHIVE`, `AUDIO`, `IMAGE`, `PRESENTATION`, `SPREADSHEET`, `TEXT_DOCUMENT`, `VIDEO`, `OTHER`
