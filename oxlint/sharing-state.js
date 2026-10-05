// These stores aggregate findings across files; lint runs single-threaded so
// results do not depend on parallel file completion order.
export const repeatedBodies = new Map();

export const recursiveBodies = new Map();

export const sharedSequences = new Map();

export const choiceCandidates = [];

export const sequenceCandidates = [];

export const keywordCandidates = [];

export const inlineKeywordFamilies = new Map();

export const sharedChoices = new Map();

export const sharedStatementAliases = new Map();

export const sharedExpressionAliases = new Map();

export const sharedItemAliases = new Map();

export const sharedFieldBodies = new Map();

export const sharedCommaFields = [];

export const sharedCommaContinuations = [];

export const sharedBlockCloses = [];

export const sharedDeclarationTails = [];

export const sharedAssignmentClauses = [];

export const sharedDelimiterFieldPrefixes = [];

export const sharedValuedFragments = [];

export const sharedFieldMarkers = [];

export const forwardedAliasDefinitions = [];

export const repeatedSignatureCandidates = [];

export const sharedScopedDeclarationHeads = [];

export const sharedModifierAliasSequences = [];

export const contextualValuedChoiceSites = [];

export function resetSharingCandidates() {
  repeatedBodies.clear();
  recursiveBodies.clear();
  sharedSequences.clear();
  choiceCandidates.length = 0;
  sequenceCandidates.length = 0;
  keywordCandidates.length = 0;
  inlineKeywordFamilies.clear();
  sharedChoices.clear();
  sharedStatementAliases.clear();
  sharedExpressionAliases.clear();
  sharedItemAliases.clear();
  sharedFieldBodies.clear();
  sharedCommaFields.length = 0;
  sharedCommaContinuations.length = 0;
  sharedBlockCloses.length = 0;
  sharedDeclarationTails.length = 0;
  sharedAssignmentClauses.length = 0;
  sharedDelimiterFieldPrefixes.length = 0;
  sharedValuedFragments.length = 0;
  sharedFieldMarkers.length = 0;
  forwardedAliasDefinitions.length = 0;
  repeatedSignatureCandidates.length = 0;
  sharedScopedDeclarationHeads.length = 0;
  sharedModifierAliasSequences.length = 0;
  contextualValuedChoiceSites.length = 0;
}
