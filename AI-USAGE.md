# Feature 1: Add Package modal

## The prompt or context you provided to the AI tool

"When user clicks on the 'Add Package' button, display a new modal with input fields for Title, Destination, Price, and Duration."

## What the AI suggested and whether you accepted, modified, or rejected the suggestion

AI generated input fields for Title, Destination, Price, and Duration but implemented the Destination field as a plain text input expecting a Destination ID. This approach assumed the user would already know or manually look up the corresponding ID, which creates a poor user experience.

I partially accepted the AI's suggestion. I kept the generated code for the Title, Price, and Duration fields, which were straightforward and correct, but rejected the Destination ID input field. In its place, I implemented a dropdown menu that dynamically populates with destination names pulled from the existing data, allowing users to simply select a destination rather than enter a raw ID. This change prioritized usability while still correctly mapping the selection to the appropriate Destination ID behind the scenes.

## How you validated the AI-generated code (testing, manual review, or debugging)

I validated the AI-generated code using a combination of manual code review and live browser testing on localhost. During code review, I examined the structure of the modal to ensure the input fields were correctly defined and that the form would capture and submit the right data types.

I then launched the application locally and interacted with the UI directly by clicking the "Add Package" button to confirm the modal rendered correctly, verifying that the dropdown populated with the expected destination names, and submitting the form to ensure the data was passed through accurately. This hands-on testing helped me catch that the original AI-generated Destination field would not have been user-friendly.

## Any limitations or hallucinations you encountered and how you handled them

One limitation I encountered was the AI's tendency to generate technically functional but user-unfriendly solutions. For example, AI implemented the Destination field as a plain text input expecting a raw Destination ID rather than a human-readable name. While this was not incorrect from a purely technical standpoint, it reflected the AI's lack of awareness of the end-user experience. AI defaulted to the simplest data-driven solution without considering usability. I handled this by rejecting that portion of the code and replacing it with a dropdown menu populated with destination names, which required me to think critically about what the AI produced rather than accepting it at face value.

# Feature 2: Actions column with Edit & Delete buttons

## The prompt or context you provided to the AI tool

"Please add an Actions column with Edit and Delete buttons for each record in both Destinations and Packages tables on the right side. Align the Actions columns and Edit/Delete buttons so they line up vertically in both tables on the UI."

## What the AI suggested and whether you accepted, modified, or rejected the suggestion

AI successfully generated the Actions column with Edit and Delete buttons for both the Destinations and Packages tables. However, the output had two noticeable layout issues. First, the column widths were inconsistent between the two tables, meaning the Actions columns did not visually align with each other on the page. Second, the Edit and Delete buttons were stacked vertically rather than displayed side by side in the same row, which made the UI look cluttered and took up unnecessary vertical space in each table row.

I accepted the core functionality. The column structure and button logic were correct but I modified the styling to resolve both issues. I manually adjusted the column width values in the code to make the Actions columns consistent across both tables. For the button layout, I used follow-up prompting to instruct the AI to place the Edit and Delete buttons inline next to each other, then reviewed and applied the suggested changes after confirming they produced the intended result.

## How you validated the AI-generated code (testing, manual review, or debugging)

I validated the changes through an iterative cycle of visual testing and code review in the localhost browser. After each AI-generated and manually applied modification, I reloaded the UI to inspect the layout and confirm the changes rendered as expected. I specifically checked that the Actions columns in both tables were the same width and aligned vertically on the screen, and that the Edit and Delete buttons appeared side by side within each row.

When the initial output didn't meet these requirements, I used the visual feedback from the browser as a guide to determine what further code adjustments or follow-up prompts were needed. This back-and-forth process continued until the layout was consistent and visually clean across both tables.

## Any limitations or hallucinations you encountered and how you handled them

Another limitation was AI's inconsistency with CSS and layout styling. When generating the Actions column for both tables, the AI produced mismatched column widths and stacked buttons vertically instead of placing them inline. This suggests the AI did not fully account for how the two tables would render together on the same page. I addressed this through a combination of manual code edits and follow-up prompting, guiding the AI toward the correct visual output by providing more specific layout instructions.
