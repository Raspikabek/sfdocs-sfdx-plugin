# {{CustomObject.label}}
## Sharing Model & Visibility
Sharing Model: {{CustomObject.sharingModel}}

Visibility: {{CustomObject.visibility}}

## Config

| Config Name | Enabled |
| --- | --- |
| allowInChatterGroups | {{CustomObject.allowInChatterGroups}} |
| enableActivities | {{CustomObject.enableActivities}} |
| enableBulkApi | {{CustomObject.enableBulkApi}} |
| enableFeeds | {{CustomObject.enableFeeds}} |
| enableHistory | {{CustomObject.enableHistory}} |
| enableLicensing | {{CustomObject.enableLicensing}} |
| enableReports | {{CustomObject.enableReports}} |
| enableSearch | {{CustomObject.enableSearch}} |
| enableSharing | {{CustomObject.enableSharing}} |
| enableStreamingApi | {{CustomObject.enableStreamingApi}} |

## Fields

| Field Name | Label | Type | Required | Unique | Length | Precision,Scale | Reference To| Default Value | Formula | Formula Treat Blank As |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Name | {{CustomObject.nameField.Label}} | {{CustomObject.nameField.type}} |
{{#each CustomObject.fields}}
| {{fullName}} | {{label}} | {{type}} | {{required}} | {{unique}} | {{length}} | {{precision}},{{scale}} | {{referenceTo}} | {{defaultValue}} | {{formula}} | {{formulaTreatBlanksAs}} |
{{/each}}

## Compact Layouts

Compact Layout Assignment: {{CustomObject.compactLayoutAssignment}}

| Full Name | Label | Fields |
| --- | --- | --- |
{{#each CustomObject.compactLayouts}}
| {{fullName}} | {{label}} | {{#each fields}} {{this}} {{/each}} |
{{/each}}

## List Views

| Full Name | Label | Columns | Filter Scope |
| --- | --- | --- | --- |
{{#each CustomObject.listViews}}
| {{fullName}} | {{label}} | {{#each columns}} {{this}} {{/each}} | {{filterScope}} |
{{/each}}