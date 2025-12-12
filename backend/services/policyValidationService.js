/**
 * Policy Validation Service - ToCampus Backend
 * 
 * Implements university policy validation for user-generated content
 * Checks content against configurable rules before approval
 * 
 * @version 1.0.0
 */

// Prohibited terms that violate university policy
const PROHIBITED_TERMS = [
  'hate', 'discriminat', 'racist', 'sexist', 'harass',
  'illegal', 'drug', 'alcohol', 'violence'
];

// Content policy rules
const POLICY_RULES = {
  minTitleLength: 5,
  maxTitleLength: 200,
  minDescriptionLength: 20,
  maxDescriptionLength: 5000,
  minLocationLength: 3,
  maxLocationLength: 100,
  requiresLocation: true,
  requiresDescription: true,
  checkProhibitedTerms: true,
  checkSpamPatterns: true
};

/**
 * Validate content against university policy
 * Returns validation result with status and detailed feedback
 */
function validateContentPolicy(content, contentType = 'Event') {
  const result = {
    isValid: true,
    violations: [],
    warnings: [],
    score: 100
  };

  // Extract fields based on content type
  const title = content.title || content.name || '';
  const description = content.description || content.content || '';
  const location = content.location || '';

  // 1. Title validation
  if (title.length < POLICY_RULES.minTitleLength) {
    result.violations.push(`Title is too short (minimum ${POLICY_RULES.minTitleLength} characters)`);
    result.score -= 10;
  }
  if (title.length > POLICY_RULES.maxTitleLength) {
    result.violations.push(`Title is too long (maximum ${POLICY_RULES.maxTitleLength} characters)`);
    result.score -= 10;
  }

  // 2. Description validation
  if (POLICY_RULES.requiresDescription && !description) {
    result.violations.push('Description is required');
    result.score -= 15;
  }
  if (description && description.length < POLICY_RULES.minDescriptionLength) {
    result.violations.push(`Description is too short (minimum ${POLICY_RULES.minDescriptionLength} characters)`);
    result.score -= 10;
  }
  if (description && description.length > POLICY_RULES.maxDescriptionLength) {
    result.violations.push(`Description is too long (maximum ${POLICY_RULES.maxDescriptionLength} characters)`);
    result.score -= 10;
  }

  // 3. Location validation (for events)
  if (contentType === 'Event') {
    if (POLICY_RULES.requiresLocation && !location) {
      result.violations.push('Location is required for events');
      result.score -= 15;
    }
    if (location && location.length < POLICY_RULES.minLocationLength) {
      result.violations.push(`Location is too short (minimum ${POLICY_RULES.minLocationLength} characters)`);
      result.score -= 5;
    }
    if (location && location.length > POLICY_RULES.maxLocationLength) {
      result.violations.push(`Location is too long (maximum ${POLICY_RULES.maxLocationLength} characters)`);
      result.score -= 5;
    }
  }

  // 4. Prohibited terms check
  if (POLICY_RULES.checkProhibitedTerms) {
    const contentToCheck = (title + ' ' + description).toLowerCase();
    const foundTerms = PROHIBITED_TERMS.filter(term => 
      contentToCheck.includes(term)
    );

    if (foundTerms.length > 0) {
      result.violations.push(
        `Content contains prohibited terms: ${foundTerms.join(', ')}. ` +
        `Please revise to ensure compliance with university community standards.`
      );
      result.score -= 25;
    }
  }

  // 5. Spam pattern detection
  if (POLICY_RULES.checkSpamPatterns) {
    // Check for excessive repetition
    const lines = description.split('\n');
    const repeatCount = lines.filter((line, i) => i > 0 && line === lines[i - 1]).length;
    
    if (repeatCount > 3) {
      result.warnings.push('Content contains excessive repetition');
      result.score -= 5;
    }

    // Check for excessive caps
    const capsCount = (description.match(/[A-Z]/g) || []).length;
    const capsRatio = capsCount / description.length;
    
    if (capsRatio > 0.5) {
      result.warnings.push('Excessive use of capital letters detected');
      result.score -= 3;
    }

    // Check for excessive punctuation
    const puncCount = (description.match(/[!?]{2,}/g) || []).length;
    
    if (puncCount > 3) {
      result.warnings.push('Excessive use of punctuation detected');
      result.score -= 3;
    }
  }

  // 6. URL validation (prevent suspicious links)
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const urls = (title + ' ' + description).match(urlPattern) || [];
  
  if (urls.length > 5) {
    result.warnings.push('Unusually high number of links detected');
    result.score -= 5;
  }

  // Determine overall validity
  result.isValid = result.violations.length === 0 && result.score >= 60;

  return result;
}

/**
 * Generate approval summary with recommendations
 */
function generateApprovalSummary(validationResult, content, contentType) {
  const summary = {
    policyCompliance: validationResult.isValid,
    overallScore: Math.max(0, validationResult.score),
    checks: {
      contentLength: validationResult.violations.filter(v => v.includes('too short') || v.includes('too long')).length === 0,
      noProhibitedContent: !validationResult.violations.some(v => v.includes('prohibited terms')),
      noSpamPatterns: validationResult.warnings.length < 3,
      locationProvided: contentType !== 'Event' || (content.location && content.location.length > 0)
    },
    recommendation: validationResult.isValid ? 'APPROVE' : 'REJECT',
    reviewNotes: [
      ...validationResult.violations.map(v => `❌ ${v}`),
      ...validationResult.warnings.map(w => `⚠️ ${w}`)
    ]
  };

  return summary;
}

/**
 * Generate human-readable rejection reason from violations
 */
function generateRejectionReason(validationResult) {
  if (validationResult.isValid) {
    return null;
  }

  const violations = validationResult.violations;
  
  if (violations.length === 0) {
    return 'Content quality score is below acceptable threshold.';
  }

  if (violations.length === 1) {
    return violations[0];
  }

  const firstViolation = violations[0];
  const additionalCount = violations.length - 1;
  
  return `${firstViolation} (Plus ${additionalCount} additional issue(s) - see details below)\n\n` +
         violations.map((v, i) => `${i + 1}. ${v}`).join('\n');
}

/**
 * Check if content can be auto-approved based on policy
 */
function canAutoApprove(validationResult) {
  return validationResult.isValid && validationResult.score >= 85;
}

/**
 * Create policy violation report
 */
function createViolationReport(content, validationResult, contentType = 'Event') {
  return {
    timestamp: new Date().toISOString(),
    contentType,
    contentId: content.id,
    contentTitle: content.title || content.name,
    validation: validationResult,
    summary: generateApprovalSummary(validationResult, content, contentType),
    requiresManualReview: !validationResult.isValid,
    suggestedAction: canAutoApprove(validationResult) ? 'AUTO_APPROVE' : 'MANUAL_REVIEW'
  };
}

module.exports = {
  validateContentPolicy,
  generateApprovalSummary,
  generateRejectionReason,
  canAutoApprove,
  createViolationReport,
  POLICY_RULES
};
