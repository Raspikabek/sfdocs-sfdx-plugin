# Sharing Rule - {{name}}

## Criteria:

{{#each (toArray SharingRules.sharingCriteriaRules)}}
### {{fullName}}
- Label: {{label}}
- Access Level: {{accessLevel}}
- Shared To: {{#each (toArray sharedTo.group)}} {{.}},{{/each}}
{{/each}}