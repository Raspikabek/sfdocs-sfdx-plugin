<!-- Custom Metadata -->
# Custom Metadata - {{name}}

- Label: {{CustomMetadata.label}}
- Protected: {{CustomMetadata.protected}}

{{#each CustomMetadata.values}}
- Field: {{field}}
  - Value: {{value.text}}
{{/each}}

