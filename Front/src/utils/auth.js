export const ROLES = {
  ADMIN: "ADMIN",
  AGENT_SECURITE: "AGENT_SECURITE",
  ETUDIANT: "ETUDIANT",
};

export function getUserRole() {
  return localStorage.getItem("role");
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role);
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
}

export function isAuthenticated() {
  return !!localStorage.getItem("user");
}

export function hasRole(allowedRoles) {
  const currentRole = getUserRole();
  return allowedRoles.includes(currentRole);
}
