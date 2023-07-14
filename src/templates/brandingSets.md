<!-- Branding Set -->
# Branding Set - {{name}}

{{#with BrandingSet}}
- Master Label: {{masterLabel}}
{{#each brandingSetProperty}}
- {{propertyName}}: {{propertyValue}}
{{/each}}
{{/with}}