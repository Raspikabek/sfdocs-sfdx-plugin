<!-- Prompt -->
# Prompt - {{name}}

- Full Name: {{fullName}}
- Name: {{name}}
- Master Label: {{Prompt.masterLabel}}

{{#if Prompt.promptVersions}}
## Prompt Versions:
{{#each Prompt.promptVersions}}
### {{masterLabel}}

- Version Number: {{versionNumber}}
- Master Label: {{masterLabel}}
- Title: {{title}}
- Body: {{body}}
- Delay Days: {{delayDays}}
- Dismiss Button Label: {{dismissButtonLabel}}
- Display Position: {{displayPosition}}
- Display Type: {{displayType}}
- Published Date: {{publishedDate}}
- Is Published: {{isPublished}}
- Should Display Action Button: {{shouldDisplayActionButton}}
- Should Ignore Global Delay: {{shouldIgnoreGlobalDelay}}
- Start Date: {{startDate}}
- Step Number: {{stepNumber}}
- Target App Developer Name: {{targetAppDeveloperName}}
- Target Page Key 1: {{targetPageKey1}}
- Target Page Type: {{targetPageType}}
- Times To Display: {{timesToDisplay}}
- User Access: {{userAccess}}
- User Profile Access: {{userProfileAccess}}
{{/each}}
{{else}}
No prompt versions specified.
{{/if}}