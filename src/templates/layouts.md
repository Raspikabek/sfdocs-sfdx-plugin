<!-- Layout -->
# Layout - {{name}}

- Full Name: {{fullName}}
- Name: {{name}}
- Exclude Buttons: {{Layout.excludeButtons}}

{{#each Layout.layoutSections}}
### {{label}}
- Custom Label: {{customLabel}}
- Detail Heading: {{detailHeading}}
- Edit Heading: {{editHeading}}
- Label: {{label}}

{{#if (eq style "OneColumn")}}
{{#if layoutColumns.layoutItems}}
| Field             |
|-------------------|
{{#each (toArray layoutColumns.layoutItems)}}
| {{field}}         |
{{/each}}
{{else}}
No layout columns specified.
{{/if}}
{{else if (eq style "CustomLinks")}}
{{#if layoutColumns}}
{{#each (toArray layoutColumns)}}
{{#if (eq . "")}}
{{else}}
- {{.}}
{{/if}}
{{/each}}
{{else}}
No custom links specified.
{{/if}}
{{else}}
{{#if (isArray (toArray layoutColumns.[0].layoutItems))}}
| Column 1             | Column 2 |
|-------------------|-----------|
{{#each (toArray layoutColumns.[0].layoutItems)}}
{{#with (lookup (toArray ../layoutColumns.[1].layoutItems) @index)}}
| {{../field}} ({{../behavior}})       | {{field}} ({{behavior}})  |
{{/with}}
{{/each}}
{{else}}
No layout columns specified.
{{/if}}
{{/if}}

Style: {{style}}

{{/each}}

<!-- Related Lists -->
## Related Lists

- Fields: {{Layout.relatedLists.fields}}
- Related List: {{Layout.relatedLists.relatedList}}

<!-- Summary Layout -->
## Summary Layout

- Master Label: {{Layout.summaryLayout.masterLabel}}
- Size X: {{Layout.summaryLayout.sizeX}}
- Size Y: {{Layout.summaryLayout.sizeY}}
- Summary Layout Style: {{Layout.summaryLayout.summaryLayoutStyle}}

