# {{PermissionSet.label}}

## {{PermissionSet.deploymentStatus}}

{{#each PermissionSet.classAccesses}}
{{apexClass}}
{{/each}}

| Tab Name | Visibility |
| -------- | ---------- |
{{#each PermissionSet.tabSettings}}
| {{tab}} | {{visibility}} |
{{/each}}
