# Security Policy

## Dependency Risk Assessment

### browser-image-compression (Supply-Chain Risk)

**Package:** `browser-image-compression@2.0.2`
**License:** MIT
**Status:** ⚠️ **LOW MAINTENANCE RISK**

#### Risk Analysis

| Factor | Status | Details |
|--------|--------|---------|
| Last Update | March 2023 | 3+ years inactive |
| Maintenance | Low | No active development |
| Security Patches | Delayed | Potential delayed fixes |
| Snyk Rating | Low-maintenance | Flagged for supply-chain risk |

#### Mitigation Measures

1. **Locked Version**: Version pinned in `package-lock.json`
2. **Code Review**: Package source reviewed - pure client-side image compression
3. **Scope Limited**: Used only in admin asset upload feature
4. **No Transitive Risk**: Minimal dependencies, no known CVEs at time of audit
5. **Monitoring**: `npm audit` runs in CI pipeline

#### Audit Results

```bash
$ npm audit
# Moderate and high severity vulnerabilities detected in dev dependencies
# No direct vulnerabilities in browser-image-compression
```

#### Action Plan

| Priority | Action | Timeline |
|----------|--------|----------|
| P2 | Evaluate alternatives (e.g., `compressorjs`, custom WASM) | Next quarter |
| P3 | Document acceptance in release notes | Before release |
| Ongoing | Monitor Snyk/npm audit alerts | Continuous |

#### Compensating Controls

- Image processing happens client-side only (no server exposure)
- Input validation on file type and size before compression
- Admin-only feature (authenticated users only)
- Regular dependency audits via CI/CD

## Reporting Security Issues

Please report security vulnerabilities to the maintainers privately.
