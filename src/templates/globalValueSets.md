# Custom Value Set - {{name}}
- Full Name: {{fullName}}
- Name: {{name}}

## Global Value Set
- Master Label: {{GlobalValueSet.masterLabel}}
- Sorted: {{GlobalValueSet.sorted}}

### Custom Values:
| Full Name | Label | Default |
| ---------- | ------ | ------- |
{{#each GlobalValueSet.customValue}}
| {{fullName}} | {{label}} | {{}} |
{{/each}}
