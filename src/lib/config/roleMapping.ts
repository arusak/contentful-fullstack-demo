export const roleMapping: Record<string, string[]> = {
  'Support': ['customerSupport', 'selfSupport'],
  'Customer': ['selfSupport', 'newCustomer'],
  'Tech Advisor': ['customerSupport', 'hardwareIssues'],
}

export const validRoles = Object.keys(roleMapping)
