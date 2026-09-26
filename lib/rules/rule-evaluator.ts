import { DocumentItem, RuleDefinition, ApprovalTask, ExtractedField } from "@/types";

export interface RuleEvaluationResult {
  rule: RuleDefinition;
  matched: boolean;
  actionTriggered?: {
    type: RuleDefinition["action"]["type"];
    description: string;
    generatedApproval?: Partial<ApprovalTask>;
  };
}

export function evaluateRules(
  document: DocumentItem,
  rules: RuleDefinition[]
): RuleEvaluationResult[] {
  const results: RuleEvaluationResult[] = [];

  // Build field lookup dictionary
  const fieldMap: Record<string, any> = {
    overallConfidence: document.overallConfidence,
    documentType: document.documentType,
    pageCount: document.pageCount,
    fileSizeBytes: document.fileSizeBytes,
  };

  if (document.extractedFields) {
    document.extractedFields.forEach((f) => {
      let val: any = f.extractedValue;
      if (f.dataType === "number" || f.dataType === "currency") {
        val = parseFloat(f.extractedValue.replace(/[^0-9.-]+/g, "")) || 0;
      }
      fieldMap[f.fieldName] = val;
    });
  }

  rules.forEach((rule) => {
    if (!rule.isActive) return;

    // Check document type match if not 'Other'
    if (
      rule.targetDocumentType !== "Other" &&
      rule.targetDocumentType !== document.documentType
    ) {
      return;
    }

    const targetVal = fieldMap[rule.condition.field];
    const conditionVal = rule.condition.value;
    let isMatched = false;

    if (targetVal !== undefined) {
      switch (rule.condition.operator) {
        case ">":
          isMatched = Number(targetVal) > Number(conditionVal);
          break;
        case "<":
          isMatched = Number(targetVal) < Number(conditionVal);
          break;
        case ">=":
          isMatched = Number(targetVal) >= Number(conditionVal);
          break;
        case "<=":
          isMatched = Number(targetVal) <= Number(conditionVal);
          break;
        case "==":
          isMatched = String(targetVal).toLowerCase() === String(conditionVal).toLowerCase();
          break;
        case "!=":
          isMatched = String(targetVal).toLowerCase() !== String(conditionVal).toLowerCase();
          break;
        case "contains":
          isMatched = String(targetVal).toLowerCase().includes(String(conditionVal).toLowerCase());
          break;
        default:
          isMatched = false;
      }
    }

    if (isMatched) {
      let generatedApproval: Partial<ApprovalTask> | undefined;

      if (rule.action.type === "REQUIRE_APPROVAL") {
        const totalAmount = fieldMap["total"] || fieldMap["amount"] || undefined;
        generatedApproval = {
          id: `appr-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          organizationId: document.organizationId,
          documentId: document.id,
          documentName: document.name,
          documentType: document.documentType,
          title: `${document.documentType} Signoff: ${fieldMap["vendor"] || document.name}`,
          description: `Triggered by deterministic rule "${rule.name}": Value (${targetVal}) satisfied condition ${rule.condition.operator} ${rule.condition.value}.`,
          requiredRole: rule.action.targetRole || "MANAGER",
          status: "PENDING",
          amount: typeof totalAmount === "number" ? totalAmount : undefined,
          currency: "INR",
          vendorOrRequester: fieldMap["vendor"] || fieldMap["employee_name"] || "Internal",
          confidence: document.overallConfidence,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        };
      }

      results.push({
        rule,
        matched: true,
        actionTriggered: {
          type: rule.action.type,
          description: `Rule "${rule.name}" triggered: ${rule.description}`,
          generatedApproval,
        },
      });
    }
  });

  return results;
}
