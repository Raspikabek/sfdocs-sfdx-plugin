<!-- Content Asset -->
# Content Asset - {{name}}

- Full Name: {{fullName}}
- Name: {{name}}
- Language: {{ContentAsset.language}}
- Master Label: {{ContentAsset.masterLabel}}

{{#if ContentAsset.relationships}}
## Relationships:
{{#each (toArray ContentAsset.relationships)}}
{{#if organization}}
- Organization Access: {{organization.access}}
{{else if network}}
- Network Access: {{network.access}}
- Network Name: {{network.name}}
{{else if workspace}}
- Workspace Access: {{workspace.access}}
- Workspace Is Managing Workspace: {{workspace.isManaingWorkspace}}
- Workspace Name: {{workspace.name}}
{{else}}
- {{this}}
{{/if}}
{{/each}}
{{else}}
No relationships specified.
{{/if}}

{{#if ContentAsset.versions}}
**Versions:**
{{#each (toArray ContentAsset.versions)}}
- Version Number: {{version.number}}
  - Path on Client: {{version.pathOnClient}}
{{/each}}
{{else}}
No versions specified.
{{/if}}
