# Profile Definition

{{#each Profile.objectPermissions}}
## {{uppercase object}}
Read Access: {{allowRead}}

Edit Access: {{allowEdit}}

Create Access: {{allowCreate}}

Delete Access: {{allowDelete}}

View All Records: {{viewAllRecords}}

Modify All Records: {{modifyAllRecords}}

### Fields:
| Field | Editable | Readable |
| --- | --- | --- |
    {{#each ../Profile.fieldPermissions}}
        {{#if (isFieldRelated ../object field)}}
| {{field}} | {{editable}} | {{readable}}
        {{/if}}
    {{/each}}
{{/each}}


Is this a Custom Profile? {{Profile.custom}}

User License: {{Profile.userLicense}}

## Application Visibilities
| Application | Default? | Visible |
| ---- | ---- | ---- |
{{#each Profile.applicationVisibilities}}
| {{application}} | {{default}} | {{visible}} |
{{/each}}

<!-- 
## Apex Classes
| Class Name | Enabled? |
| ---- | ---- |
{{#each Profile.classAccesses}}
| {{apexClass}} | {{enabled}} |
{{/each}} -->

## Custom Metadata Type Access
| Custom Metadata | Enabled |
| ---- | ---- |
{{#each Profile.customMetadataTypeAccesses}}
| {{name}} | {{enabled}} |
{{/each}}

## Object Permissions 2
{{#each Profile.objectPermissions}}
### Object Name: {{object}}
* Read: {{allowRead}}
* Edit: {{allowRead}}
* Create: {{allowRead}}
* Delete: {{allowRead}}
* View All Records: {{allowRead}}
* Modify All Records: {{allowRead}}

### {{object}} field permissions

{{/each}}


## Record Type Visibilities
| Record Type | Visible | Default | Person Account Default?
| ---- | ---- | ---- | ---- |
{{#each Profile.recordTypeVisibilities}}
| {{recordType}} | {{visible}} | {{default}} | {{personAccountDefault}}
{{/each}}

## Field Permissions
| Field | Read Access | Edit Access |
| ---- | ---- | ---- |
{{#each Profile.fieldPermissions}}
| {{field}} | {{readable}} | {{editable}}
{{/each}}

## Layout assignments
| Layout Name | Record Type |
| ---- | ---- |
{{#each Profile.layoutAssignments}}
| {{layout}} | {{recordType}} |
{{/each}}

## Tab Visibilities
| Tab Name | Visibility |
| ---- | ---- |
{{#each Profile.tabVisibilities}}
| {{tab}} | {{visibility}} |
{{/each}}

## User Permissions
| Permission Name | Enabled |
| ---- | ---- |
{{#each Profile.userPermissions}}
| {{name}} | {{enabled}} |
{{/each}}