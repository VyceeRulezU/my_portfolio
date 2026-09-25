// GROQ queries for project documents. Kept dependency-free so /api/unlock can import it.

export const CARD_FIELDS = `_id, "id": slug.current, title, num, type, role, year, desc, url, img, imgUrl, isPrivate`;

// Case-study body. Never sent to the browser for private projects until /api/unlock verifies the password.
export const GATED_FIELDS = `overview, overviewImages, problem, problemImages, solution, solutionImages, impact, impactImages, processImages`;

export const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)] | order(num asc) { ${CARD_FIELDS} }`;

export const PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  ${CARD_FIELDS},
  headline,
  r2Folder,
  "hasPassword": defined(password),
  isPrivate != true => { ${GATED_FIELDS} }
}`;
