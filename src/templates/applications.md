# {{CustomApplication.label}}

# Brand:

- Header Color: {{CustomApplication.brand.headerColor}}
- Logo: {{CustomApplication.brand.logo}}
- Should override Org Theme? {{CustomApplication.brand.shouldOverrideOrgTheme}}
- UI Type: {{CustomApplication.uiType}}
{{#if CustomApplication.utilityBar}}
- {{CustomApplication.utilityBar}}
{{/if}}
# Form Factors:

{{#each CustomApplication.formFactors}}
- {{this}}
{{/each}}

## Action Overrides:

| Action Name | Content | Form Factor | Type | Page Or SObject Type | Comment |
| --- | --- | --- | --- | --- | --- |
{{#each CustomApplication.actionOverrides}}
| {{actionName}} | {{content}} | {{formFactor}} | {{type}} | {{pageOrSobjectType}} | {{comment}} |
{{/each}}

# Tabs:

{{#each CustomApplication.tabs}}
- {{this}}
{{/each}}