# Your API design decisions: resource choice, URL structure, and status code usage

This API models two clear resources for travel planning: destinations and packages. That choice keeps the domain simple and realistic — destinations represent places, while packages represent purchasable travel offerings linked to a destination.

The URL structure follows REST conventions with noun-based, plural endpoints and predictable patterns: collection endpoints for listing/creating (for example, /api/destinations, /api/packages) and parameterized item endpoints for single-resource operations (/:id). Filtering is handled with query parameters (like destination name, country, or destinationId), which keeps URLs expressive without creating many custom routes.

Status code usage is consistent with standard CRUD semantics: 200 for successful reads/updates, 201 for successful creates, 204 for successful deletes with no response body, 400 for invalid input, 404 for missing resources/routes, and 500 via centralized error handling for unexpected server failures. This makes end user behavior predictable and easier to debug.

# How you organized Express routes and middleware and why

This project uses a layered Express structure so each file has one clear responsibility.

Routes are split by resource into separate router files (destinations and packages), and each router contains only endpoint logic for that resource (CRUD + filtering). The main server file stays small by just handling app setup and mounting routers under /api/..., which makes the code easier to navigate and scale as more resources are added.

Middleware is organized into reusable modules and applied in a deliberate order. Global middleware (JSON parsing, request logging, static file serving) runs early for every request. Route-level middleware (like required-field validation and async error wrapping) is applied where needed so validation and async handling are consistent across endpoints. Finally, centralized 404 and error-handling middleware is registered at the end, ensuring unmatched routes and runtime errors are handled in one place with consistent responses.

This organization improves maintainability, readability, and reliability: route logic stays focused, cross-cutting concerns are reusable, and error behavior is predictable throughout the API.

# How you handled errors and edge cases (invalid input, missing resources)

Errors and edge cases are handled in a consistent, layered way so users always get predictable responses.

For invalid input, route-level validation middleware checks required fields before create/update logic runs. If fields are missing, the request is rejected early with a 400 Bad Request response and a JSON body that explains what failed. This prevents incomplete data from entering the store and keeps validation behavior uniform across endpoints.

For missing resources, each read/update/delete operation looks up the target by ID first. If it doesn’t exist, the API returns 404 Not Found with a clear message (for example, destination or package not found), rather than silently succeeding or throwing an unhelpful error.

For unexpected failures, async route handlers are wrapped so thrown/rejected errors flow into a centralized error middleware. That middleware normalizes server errors into JSON responses (typically 500) and logs internal failures for debugging. A separate not-found middleware handles unmatched routes and returns a consistent 404 JSON response. Together, this gives clean handling for both expected edge cases and unplanned runtime errors.

# Your experience using AI tools: when they helped, when they didn’t, and what you learned about responsible AI usage

AI tools were most helpful in speeding up development and project setup. They helped me scaffold the project structure quickly, generate boilerplate CRUD routes, and make iterative UI/CSS refinements much faster than writing everything from scratch.

Where AI tools were less effective was in project-specific context and edge details. Sometimes AI suggestions were not aligned with my exact UI behavior, naming, or workflow needs so I still had to manually verify outputs, test changes, and adjust logic. I also saw that AI can produce changes that look complete but still require careful review (for example, dependency/config updates, staged file hygiene, or small mismatches between docs and implementation).

The biggest lesson about responsible AI usage was to treat AI as a coding assistant and not an authority. I learned to validate generated code with linting and runtime checks, review differences before committing, and ensure outputs actually satisfy requirements rather than assuming they do. I also learned to be explicit in prompts, iterate in small steps, and keep human judgment in control for quality, security, and maintainability decisions.
