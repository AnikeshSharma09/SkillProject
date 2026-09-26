# AI-FLOW: Security & Compliance Specification

## 1. Multi-Tenant Isolation
- **Row Level Security (RLS)**: Enforced directly at the PostgreSQL database level.
- **Tenant Context**: Every API request extracts and validates the user's JWT, binds the `organization_id`, and validates organizational membership.
- **Cross-Tenant Attack Surface**: Zero possibility of tenant data leaks through query parameter tampering because database policies automatically append `WHERE organization_id = current_org_id()`.

---

## 2. Role-Based Access Control (RBAC)

| Role | Documents | Workflow Builder | Approvals | Human Review | Analytics | Audit Logs | Settings |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **ADMIN** | Full (CRUD) | Full (CRUD) | Full | Full | Full | Full | Full |
| **MANAGER** | Full (CRUD) | View & Activate | Full | Full | Full | View | View |
| **APPROVER** | Read Only | View | Decide | Full | View | View | None |
| **EMPLOYEE** | Own Only | View | None | Own Only | None | None | None |
| **VIEWER** | Read Only | None | None | None | View | None | None |

---

## 3. Defense-in-Depth for AI Subsystems
1. **Adversarial Document Ingestion**:
   - Files are stripped of executable macros and dangerous script tags.
   - Text extracted from OCR is marked as untrusted and encapsulated in strict delimiters.
   - Prompt templates strictly prohibit the model from interpreting content as instruction overrides.
2. **Deterministic Execution Guarantee**:
   - The LLM's output is treated purely as structured data candidates.
   - All state transitions, money transfers, workflow routes, and database mutations are performed by deterministic application business logic.
   - No dynamic code execution (`eval`, `exec`, shell spawning) is permitted anywhere in the platform.

---

## 4. Encryption & Data Protection
- **In Transit**: TLS 1.3 enforced for all web and API traffic.
- **At Rest**: AES-256 encryption on all stored documents in Supabase storage buckets and PostgreSQL database tables.
- **Secret Management**: API keys and webhook secrets stored as encrypted environment variables or in Vault-managed stores.
