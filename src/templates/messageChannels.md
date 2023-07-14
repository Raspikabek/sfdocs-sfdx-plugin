<!-- Lightning Message Channel -->
# Lightning Message Channel - {{name}}

- Full Name: {{fullName}}
- Name: {{name}}
- Exposed: {{LightningMessageChannel.isExposed}}
- Master Label: {{LightningMessageChannel.masterLabel}}

{{#if LightningMessageChannel.lightningMessageFields}}
## Lightning Message Fields:
{{#each LightningMessageChannel.lightningMessageFields}}
- Description: {{description}}
  Field Name: {{fieldName}}
{{/each}}
{{else}}
No lightning message fields specified.
{{/if}}