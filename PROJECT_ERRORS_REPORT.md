# Project Error Report

## Critical Errors

* File: backend/src/main/java/com/culinaryrecipes/config/WebConfig.java
  * Line: (approx.) addResourceHandlers / uploadDir usage
  * Problem: app.upload.dir configuration is required but not defined in the repository (no application.properties/yaml found in inspection).
  * Cause: @Value("${app.upload.dir}") resolves at runtime; missing property will fail application startup.
  * Impact: Backend may not start.

* File: backend/src/main/java/com/culinaryrecipes/config/SecurityConfig.java
  * Line: requestMatchers(HttpMethod.GET, "/api/recipes/**") / other matcher patterns
  * Problem: Authorization rules likely do not match actual controller endpoints.
  * Cause: SecurityConfig allows GET /api/recipes/** but may not allow /api/recipes/** POST/PUT routes; RecipeController has other endpoints (e.g., POST multipart/form-data) that will be gated by auth; correctness depends on actual controller mappings.
  * Impact: 401/403 errors for valid requests.

* File: backend/src/main/java/com/culinaryrecipes/auth/AuthService.java
  * Line: register(): generateToken(User(... authorities ...))
  * Problem: JWT token generation uses Spring Security User with authorities built manually; no consistency check with CustomUserDetailsService/role mapping.
  * Cause: token authorities are created as "ROLE_" + user.getRole().name() but elsewhere authorization expects hasRole("USER") / hasRole("ADMIN").
  * Impact: Users might authenticate but fail role-based authorization.

* File: backend/src/main/java/com/culinaryrecipes/config/JwtAuthenticationFilter.java
  * Line: response.getWriter().write(""" ... """)
  * Problem: Filter writes a JSON string but does not set response character encoding.
  * Cause: no response.setCharacterEncoding("UTF-8").
  * Impact: Potential incorrect JSON encoding for non-ASCII French messages ("Veuillez vous reconnecter.").

## High Priority Issues

* File: backend/src/main/java/com/culinaryrecipes/auth/AuthController.java
  * Line: /me endpoint: me(@AuthenticationPrincipal UserDetails userDetails)
  * Problem: /api/auth/me requires AuthenticationPrincipal to be present; if JWT filter does not populate authorities/username reliably, userDetails may be null or invalid.
  * Cause: doFilterInternal sets UsernamePasswordAuthenticationToken using userDetails from userDetailsService.loadUserByUsername(username), so it should be present, but depends on JwtService.extractUsername correctness.
  * Impact: /me may return 500 or unauthorized.

* File: frontend/src/api/axios.js
  * Line: response interceptor: window.location.href = '/login'
  * Problem: React Router routes are likely not used; hard navigation may break SPA behavior.
  * Cause: direct window.location.href.
  * Impact: full page reload, loss of state; possible route mismatch.

* File: frontend/src/api/axios.js
  * Line: interceptors.request: token stored under localStorage key 'token'
  * Problem: Potential mismatch if backend expects Authorization header but some requests send multipart/form-data; axios still attaches headers, but some configs can overwrite.
  * Cause: axios instance sets Content-Type: application/json globally; multipart requests in RecipeController use consumes multipart/form-data.
  * Impact: multipart requests may send wrong Content-Type and fail.

* File: backend/src/main/java/com/culinaryrecipes/users/DashboardStatsDto.java
  * Line: fields lastUsers/lastRecipes
  * Problem: DTO includes lists but no explicit null-safety. If service returns null lists, frontend mapping can fail.
  * Cause: Lombok-generated getters/setters; no @Builder.Default for list fields.
  * Impact: NullPointerExceptions in frontend rendering.

## Medium Priority Issues

* File: backend/src/main/java/com/culinaryrecipes/config/SecurityConfig.java
  * Line: requestMatchers("/api/favorites/**").hasRole("USER")
  * Problem: Favorites endpoints may include /api/favorites/toggle (POST) and /api/favorites/{recipeId} (DELETE). Authorization requires ROLE_USER but roles must match exactly.
  * Cause: uses hasRole("USER") which expects authority "ROLE_USER"; JwtService/AuthService must produce exact authority naming.
  * Impact: 403 Forbidden even for authenticated users.

* File: backend/src/main/java/com/culinaryrecipes/config/SecurityConfig.java
  * Line: requestMatchers(HttpMethod.GET, "/api/users/profile/**").permitAll()
  * Problem: Public profile endpoint is allowed but auth endpoints may expose data.
  * Cause: broad permitAll for GET /api/users/profile/** while UserController may have both public and private profile mappings.
  * Impact: data exposure (privacy/security).

* File: backend/src/main/java/com/culinaryrecipes/auth/AuthService.java
  * Line: register(): enabled(true)
  * Problem: No email verification / account activation control.
  * Cause: enabled is always true.
  * Impact: Security weakness (users can register and authenticate immediately).

* File: backend/src/main/java/com/culinaryrecipes/config/JwtAuthenticationFilter.java
  * Line: if (jwtService.isTokenValid(jwt, userDetails))
  * Problem: No logging on invalid tokens; errors are generic.
  * Cause: catch clears context and returns 401 with message.
  * Impact: harder debugging; operational issue.

## Low Priority Issues

* File: backend/src/main/java/com/culinaryrecipes/config/JwtAuthenticationFilter.java
  * Line: doFilterInternal parameter annotations
  * Problem: @NonNull on response/request/filterChain but method still can throw IOException/ServletException.
  * Cause: defensive coding; not a functional bug.
  * Impact: minimal.

* File: frontend/src/api/axios.js
  * Line: response interceptor always redirect on 401
  * Problem: Might redirect user during background requests (e.g., pagination/search), interrupting UX.
  * Cause: unconditional redirect.
  * Impact: UX inconsistency.

# Main Blocking Problems

1. Missing runtime configuration for app.upload.dir (startup failure) — backend/src/main/java/com/culinaryrecipes/config/WebConfig.java
2. Potential role/authority mismatch between JWT authorities and SecurityConfig hasRole(...) checks — backend/src/main/java/com/culinaryrecipes/auth/AuthService.java and backend/src/main/java/com/culinaryrecipes/config/SecurityConfig.java
3. Potential multipart/form-data failures due to axios global Content-Type: application/json — frontend/src/api/axios.js vs backend RecipeController @PostMapping/@PutMapping(consumes="multipart/form-data")

# Recommended Fix Order

1. Add/verify app.upload.dir configuration (application.properties/yaml) so WebConfig does not fail startup.
2. Verify JWT authority naming consistency end-to-end: AuthService token claims/authorities vs SecurityConfig hasRole(...) expectations.
3. Adjust frontend axios defaults to avoid forcing Content-Type: application/json for multipart requests; ensure multipart requests set correct headers.
4. Re-check endpoint path matching between frontend services and backend request mappings under /api/* to resolve any remaining 401/403 issues.
5. Add null-safety/mapping guarantees for DTO list fields returned by dashboard/profile/favorites responses to prevent frontend render-time crashes.

