// The access_token cookie is httpOnly and is managed exclusively by the
// backend (Set-Cookie) and Next.js proxy. Client-side JavaScript cannot
// read or write it — that is intentional to prevent XSS token theft.
//
// clearAccessToken is kept as a no-op shim so existing import sites compile
// without changes while the actual cookie removal happens server-side
// (backend removeAccessTokenFromResponse on logout / proxy on refresh failure).
export const clearAccessToken = (): void => {
	// httpOnly cookies cannot be cleared from JS — the backend handles this.
};
