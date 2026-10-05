import { optionalPrefixHeadExtraction } from "./rules/optional-prefix-head-extraction.js";
import { nestedEventHeadExtraction } from "./rules/nested-event-head-extraction.js";
import { precedenceKeywordAliasInline } from "./rules/precedence-keyword-alias-inline.js";
import { privatePrecedenceSymbolInline } from "./rules/private-precedence-symbol-inline.js";
import { optionalSelectorBodyInline } from "./rules/optional-selector-body-inline.js";
import { intraRuleSharedChoice } from "./rules/intra-rule-shared-choice.js";
import { sharedSymbolAliasChoiceInline } from "./rules/shared-symbol-alias-choice-inline.js";
import { contextualInfixBoundary } from "./rules/contextual-infix-boundary.js";
import { infixChoiceInline } from "./rules/infix-choice-inline.js";
import { inlineDispatcherBoundary } from "./rules/inline-dispatcher-boundary.js";
import { inlineValuedChoiceBoundary } from "./rules/inline-valued-choice-boundary.js";
import { inlineLiteralChoiceBoundary } from "./rules/inline-literal-choice-boundary.js";
import { inlinePrecedenceValuedChoiceBoundary } from "./rules/inline-precedence-valued-choice-boundary.js";
import { inlineClauseChoiceBoundary } from "./rules/inline-clause-choice-boundary.js";
import { inlineKeywordNameBoundary } from "./rules/inline-keyword-name-boundary.js";
import { inlineMixedSymbolChoiceBoundary } from "./rules/inline-mixed-symbol-choice-boundary.js";
import { inlineKeywordAliasChoiceBoundary } from "./rules/inline-keyword-alias-choice-boundary.js";
import { contextualScalarNameBoundary } from "./rules/contextual-scalar-name-boundary.js";
import { contextualKeywordChoiceBoundary } from "./rules/contextual-keyword-choice-boundary.js";
import { contextualKeywordPrefixBoundary } from "./rules/contextual-keyword-prefix-boundary.js";
import { contextualValuedChoiceInline } from "./rules/contextual-valued-choice-inline.js";
import { sharedRepeatedSignature } from "./rules/shared-repeated-signature.js";
import { leftRecursiveList } from "./rules/left-recursive-list.js";
import { recursiveItemInline } from "./rules/recursive-item-inline.js";
import { recursiveItemExtraction } from "./rules/recursive-item-extraction.js";
import { recursiveChoiceItemExtraction } from "./rules/recursive-choice-item-extraction.js";
import { forwardedAliasReuse } from "./rules/forwarded-alias-reuse.js";
import { aliasForwardingInline } from "./rules/alias-forwarding-inline.js";
import { inlineTargetForwarding } from "./rules/inline-target-forwarding.js";
import { closingDelimiterHoist } from "./rules/closing-delimiter-hoist.js";
import { choiceProductExtraction } from "./rules/choice-product-extraction.js";
import { sharedFieldMarker } from "./rules/shared-field-marker.js";
import { redundantInheritedField } from "./rules/redundant-inherited-field.js";
import { singleUseFieldSequence } from "./rules/single-use-field-sequence.js";
import { sharedValuedFragment } from "./rules/shared-valued-fragment.js";
import { sharedDelimiterFieldPrefix } from "./rules/shared-delimiter-field-prefix.js";
import { sharedScopedDeclarationHead } from "./rules/shared-scoped-declaration-head.js";
import { sharedModifierAliasSequence } from "./rules/shared-modifier-alias-sequence.js";
import { sharedAssignmentClause } from "./rules/shared-assignment-clause.js";
import { shortKeywordHelperName } from "./rules/short-keyword-helper-name.js";
import { shortSharedCategoryName } from "./rules/short-shared-category-name.js";
import { shortPrivatePrefix } from "./rules/short-private-prefix.js";
import { shortAliasedLexicalName } from "./rules/short-aliased-lexical-name.js";
import { sharedDeclarationTail } from "./rules/shared-declaration-tail.js";
import { sharedBlockClose } from "./rules/shared-block-close.js";
import { optionalRepetitionInline } from "./rules/optional-repetition-inline.js";
import { choiceSuffixHoist } from "./rules/choice-suffix-hoist.js";
import { precedenceOptionalMarkerHoist } from "./rules/precedence-optional-marker-hoist.js";
import { sharedCommaContinuation } from "./rules/shared-comma-continuation.js";
import { nullableSlotList } from "./rules/nullable-slot-list.js";
import { singleUseFieldChoice } from "./rules/single-use-field-choice.js";
import { recursiveContinuationInline } from "./rules/recursive-continuation-inline.js";
import { sharedCommaField } from "./rules/shared-comma-field.js";
import { closingDelimiterWrapper } from "./rules/closing-delimiter-wrapper.js";
import { singleUseDelimitedSequence } from "./rules/single-use-delimited-sequence.js";
import { orderedOptionalChain } from "./rules/ordered-optional-chain.js";
import { optionalTailChoiceCollapse } from "./rules/optional-tail-choice-collapse.js";
import { precedenceListHeadExtraction } from "./rules/precedence-list-head-extraction.js";
import { fieldListHeadExtraction } from "./rules/field-list-head-extraction.js";
import { choiceListHeadExtraction } from "./rules/choice-list-head-extraction.js";
import { sharedFieldChunk } from "./rules/shared-field-chunk.js";
import { singleUseChoiceAliasSequence } from "./rules/single-use-choice-alias-sequence.js";
import { singleUsePrecedenceValue } from "./rules/single-use-precedence-value.js";
import { optionalModifierField } from "./rules/optional-modifier-field.js";
import { sharedFieldBody } from "./rules/shared-field-body.js";
import { sharedItemAlias } from "./rules/shared-item-alias.js";
import { sharedExpressionAlias } from "./rules/shared-expression-alias.js";
import { singleUseFieldChoiceSequence } from "./rules/single-use-field-choice-sequence.js";
import { optionalListHeadExtraction } from "./rules/optional-list-head-extraction.js";
import { singleUsePrecedenceClause } from "./rules/single-use-precedence-clause.js";
import { fieldChoiceForwardingRule } from "./rules/field-choice-forwarding-rule.js";
import { fieldForwardingRule } from "./rules/field-forwarding-rule.js";
import { singleUseAliasSequence } from "./rules/single-use-alias-sequence.js";
import { singleUseChoiceSequence } from "./rules/single-use-choice-sequence.js";
import { singleUseOptionalSequence } from "./rules/single-use-optional-sequence.js";
import { sharedStatementAlias } from "./rules/shared-statement-alias.js";
import { aliasPromotion } from "./rules/alias-promotion.js";
import { phraseAliasExtraction } from "./rules/phrase-alias-extraction.js";
import { alternativeExtraction } from "./rules/alternative-extraction.js";
import { bodyExtraction } from "./rules/body-extraction.js";
import { broadDispatcher } from "./rules/broad-dispatcher.js";
import { chunkExtraction } from "./rules/chunk-extraction.js";
import { choiceSubset } from "./rules/choice-subset.js";
import { localPrefixHelper } from "./rules/local-prefix-helper.js";
import { nonEmptyTailExtraction } from "./rules/non-empty-tail-extraction.js";
import { optionalBodyExtraction } from "./rules/optional-body-extraction.js";
import { optionalBlockBodyExtraction } from "./rules/optional-block-body-extraction.js";
import { literalCompoundAliasBoundary } from "./rules/literal-compound-alias-boundary.js";
import { leadingKeywordFieldBoundary } from "./rules/leading-keyword-field-boundary.js";
import { nestedFieldBodyExtraction } from "./rules/nested-field-body-extraction.js";
import { optionalFlagMarkerPrefix } from "./rules/optional-flag-marker-prefix.js";
import { prefixExtraction } from "./rules/prefix-extraction.js";
import { singleUseChoice } from "./rules/single-use-choice.js";
import { singleUseSharedChoiceInline } from "./rules/single-use-shared-choice-inline.js";
import { multiUsePrivateChoiceInline } from "./rules/multi-use-private-choice-inline.js";
import { sharedLexicalFieldSequenceInline } from "./rules/shared-lexical-field-sequence-inline.js";
import { multiUsePrivateKeywordChoiceInline } from "./rules/multi-use-private-keyword-choice-inline.js";
import { multiUsePrivateKeywordAliasChoiceInline } from "./rules/multi-use-private-keyword-alias-choice-inline.js";
import { multiUsePrivateKeywordFieldInline } from "./rules/multi-use-private-keyword-field-inline.js";
import { sharedKeywordInline } from "./rules/shared-keyword-inline.js";
import { singleUseSharedSequenceInline } from "./rules/single-use-shared-sequence-inline.js";
import { sharedKeywordAliasChoiceInline } from "./rules/shared-keyword-alias-choice-inline.js";
import { commonSuffixHeadExtraction } from "./rules/common-suffix-head-extraction.js";
import { sharedPrecedenceSequenceInline } from "./rules/shared-precedence-sequence-inline.js";
import { sharedClosingDelimiterInline } from "./rules/shared-closing-delimiter-inline.js";
import { sharedKeywordFieldInline } from "./rules/shared-keyword-field-inline.js";
import { preferRecursion } from "./rules/recurse.js";
import { sharedSequence } from "./rules/shared-sequence.js";
import { sharedRecursion } from "./rules/shared-recursion.js";
import { sharedRepetition } from "./rules/shared-repetition.js";
import { singleUseSequence } from "./rules/single-use-sequence.js";
import { singleUseKeywordSequence } from "./rules/single-use-keyword-sequence.js";
import { singleUsePrecedence } from "./rules/single-use-precedence.js";
import { forwardingRule } from "./rules/forwarding-rule.js";
import { sequenceSubset } from "./rules/sequence-subset.js";
import { recursiveTailReuse } from "./rules/recursive-tail-reuse.js";
import { recursiveBodyReuse } from "./rules/recursive-body-reuse.js";
import { listHeadExtraction } from "./rules/list-head-extraction.js";
import { keywordReuse } from "./rules/keyword-reuse.js";
import { inlineKeywordOwner } from "./rules/inline-keyword-owner.js";
import { sharedChoice } from "./rules/shared-choice.js";
import { tailExtraction } from "./rules/tail-extraction.js";
import { tokenPacking } from "./rules/token-packing.js";

export {
  aliasPromotion,
  phraseAliasExtraction,
  nullableSlotList,
  recursiveContinuationInline,
  optionalPrefixHeadExtraction,
  nestedEventHeadExtraction,
  choiceProductExtraction,
  sharedFieldMarker,
  sharedValuedFragment,
  sharedDelimiterFieldPrefix,
  sharedScopedDeclarationHead,
  sharedModifierAliasSequence,
  sharedAssignmentClause,
  shortKeywordHelperName,
  shortSharedCategoryName,
  shortPrivatePrefix,
  shortAliasedLexicalName,
  sharedDeclarationTail,
  sharedBlockClose,
  sharedCommaContinuation,
  sharedCommaField,
  sharedFieldChunk,
  optionalModifierField,
  optionalTailChoiceCollapse,
  orderedOptionalChain,
  optionalSelectorBodyInline,
  singleUseSequence,
  singleUseAliasSequence,
  singleUseChoiceSequence,
  singleUseFieldChoiceSequence,
  singleUseChoiceAliasSequence,
  sharedRepeatedSignature,
  leftRecursiveList,
  recursiveItemExtraction,
  recursiveChoiceItemExtraction,
  recursiveItemInline,
  forwardedAliasReuse,
  closingDelimiterHoist,
  closingDelimiterWrapper,
  redundantInheritedField,
  singleUseFieldSequence,
  singleUseFieldChoice,
  choiceSuffixHoist,
  precedenceOptionalMarkerHoist,
  optionalRepetitionInline,
  singleUseDelimitedSequence,
  singleUseOptionalSequence,
  singleUseKeywordSequence,
  singleUsePrecedenceClause,
  singleUsePrecedenceValue,
  singleUsePrecedence,
  fieldChoiceForwardingRule,
  fieldForwardingRule,
  aliasForwardingInline,
  inlineTargetForwarding,
  forwardingRule,
  sharedFieldBody,
  sharedStatementAlias,
  sharedExpressionAlias,
  sharedItemAlias,
  choiceSubset,
  inlineKeywordOwner,
  keywordReuse,
  sharedChoice,
  intraRuleSharedChoice,
  recursiveTailReuse,
  recursiveBodyReuse,
  listHeadExtraction,
  optionalListHeadExtraction,
  choiceListHeadExtraction,
  precedenceListHeadExtraction,
  fieldListHeadExtraction,
  sequenceSubset,
  sharedRepetition,
  sharedRecursion,
  sharedSequence,
  singleUseChoice,
  precedenceKeywordAliasInline,
  privatePrecedenceSymbolInline,
  sharedSymbolAliasChoiceInline,
  inlineKeywordAliasChoiceBoundary,
  contextualScalarNameBoundary,
  contextualKeywordChoiceBoundary,
  contextualKeywordPrefixBoundary,
  contextualValuedChoiceInline,
  inlineMixedSymbolChoiceBoundary,
  inlineKeywordNameBoundary,
  inlineClauseChoiceBoundary,
  inlinePrecedenceValuedChoiceBoundary,
  inlineLiteralChoiceBoundary,
  inlineValuedChoiceBoundary,
  infixChoiceInline,
  contextualInfixBoundary,
  inlineDispatcherBoundary,
  multiUsePrivateChoiceInline,
  sharedLexicalFieldSequenceInline,
  multiUsePrivateKeywordChoiceInline,
  multiUsePrivateKeywordAliasChoiceInline,
  multiUsePrivateKeywordFieldInline,
  singleUseSharedChoiceInline,
  sharedKeywordInline,
  singleUseSharedSequenceInline,
  sharedKeywordAliasChoiceInline,
  sharedPrecedenceSequenceInline,
  sharedClosingDelimiterInline,
  sharedKeywordFieldInline,
  commonSuffixHeadExtraction,
  optionalBlockBodyExtraction,
  leadingKeywordFieldBoundary,
  literalCompoundAliasBoundary,
  optionalFlagMarkerPrefix,
  nestedFieldBodyExtraction,
};
export { resetSharingCandidates } from "./sharing-state.js";

export default {
  meta: { name: "tree-sitter-optimize" },
  rules: {
    "optional-prefix-head-extraction": optionalPrefixHeadExtraction,
    "nested-event-head-extraction": nestedEventHeadExtraction,
    "precedence-keyword-alias-inline": precedenceKeywordAliasInline,
    "private-precedence-symbol-inline": privatePrecedenceSymbolInline,
    "optional-selector-body-inline": optionalSelectorBodyInline,
    "intra-rule-shared-choice": intraRuleSharedChoice,
    "shared-symbol-alias-choice-inline": sharedSymbolAliasChoiceInline,
    "contextual-infix-boundary": contextualInfixBoundary,
    "infix-choice-inline": infixChoiceInline,
    "inline-dispatcher-boundary": inlineDispatcherBoundary,
    "inline-valued-choice-boundary": inlineValuedChoiceBoundary,
    "inline-literal-choice-boundary": inlineLiteralChoiceBoundary,
    "inline-precedence-valued-choice-boundary": inlinePrecedenceValuedChoiceBoundary,
    "inline-clause-choice-boundary": inlineClauseChoiceBoundary,
    "inline-keyword-name-boundary": inlineKeywordNameBoundary,
    "inline-mixed-symbol-choice-boundary": inlineMixedSymbolChoiceBoundary,
    "inline-keyword-alias-choice-boundary": inlineKeywordAliasChoiceBoundary,
    "contextual-scalar-name-boundary": contextualScalarNameBoundary,
    "contextual-keyword-choice-boundary": contextualKeywordChoiceBoundary,
    "contextual-keyword-prefix-boundary": contextualKeywordPrefixBoundary,
    "contextual-valued-choice-inline": contextualValuedChoiceInline,
    "shared-repeated-signature": sharedRepeatedSignature,
    "left-recursive-list": leftRecursiveList,
    "recursive-item-inline": recursiveItemInline,
    "recursive-item-extraction": recursiveItemExtraction,
    "recursive-choice-item-extraction": recursiveChoiceItemExtraction,
    "forwarded-alias-reuse": forwardedAliasReuse,
    "alias-forwarding-inline": aliasForwardingInline,
    "inline-target-forwarding": inlineTargetForwarding,
    "closing-delimiter-hoist": closingDelimiterHoist,
    "choice-product-extraction": choiceProductExtraction,
    "shared-field-marker": sharedFieldMarker,
    "redundant-inherited-field": redundantInheritedField,
    "single-use-field-sequence": singleUseFieldSequence,
    "shared-valued-fragment": sharedValuedFragment,
    "shared-delimiter-field-prefix": sharedDelimiterFieldPrefix,
    "shared-scoped-declaration-head": sharedScopedDeclarationHead,
    "shared-modifier-alias-sequence": sharedModifierAliasSequence,
    "shared-assignment-clause": sharedAssignmentClause,
    "short-keyword-helper-name": shortKeywordHelperName,
    "short-shared-category-name": shortSharedCategoryName,
    "short-private-prefix": shortPrivatePrefix,
    "short-aliased-lexical-name": shortAliasedLexicalName,
    "shared-declaration-tail": sharedDeclarationTail,
    "shared-block-close": sharedBlockClose,
    "optional-repetition-inline": optionalRepetitionInline,
    "choice-suffix-hoist": choiceSuffixHoist,
    "precedence-optional-marker-hoist": precedenceOptionalMarkerHoist,
    "shared-comma-continuation": sharedCommaContinuation,
    "nullable-slot-list": nullableSlotList,
    "single-use-field-choice": singleUseFieldChoice,
    "recursive-continuation-inline": recursiveContinuationInline,
    "shared-comma-field": sharedCommaField,
    "closing-delimiter-wrapper": closingDelimiterWrapper,
    "single-use-delimited-sequence": singleUseDelimitedSequence,
    "ordered-optional-chain": orderedOptionalChain,
    "optional-tail-choice-collapse": optionalTailChoiceCollapse,
    "precedence-list-head-extraction": precedenceListHeadExtraction,
    "field-list-head-extraction": fieldListHeadExtraction,
    "choice-list-head-extraction": choiceListHeadExtraction,
    "shared-field-chunk": sharedFieldChunk,
    "single-use-choice-alias-sequence": singleUseChoiceAliasSequence,
    "single-use-precedence-value": singleUsePrecedenceValue,
    "optional-modifier-field": optionalModifierField,
    "shared-field-body": sharedFieldBody,
    "shared-item-alias": sharedItemAlias,
    "shared-expression-alias": sharedExpressionAlias,
    "single-use-field-choice-sequence": singleUseFieldChoiceSequence,
    "optional-list-head-extraction": optionalListHeadExtraction,
    "single-use-precedence-clause": singleUsePrecedenceClause,
    "field-choice-forwarding-rule": fieldChoiceForwardingRule,
    "field-forwarding-rule": fieldForwardingRule,
    "single-use-alias-sequence": singleUseAliasSequence,
    "single-use-choice-sequence": singleUseChoiceSequence,
    "single-use-optional-sequence": singleUseOptionalSequence,
    "shared-statement-alias": sharedStatementAlias,
    "alias-promotion": aliasPromotion,
    "phrase-alias-extraction": phraseAliasExtraction,
    "alternative-extraction": alternativeExtraction,
    "body-extraction": bodyExtraction,
    "broad-dispatcher": broadDispatcher,
    "chunk-extraction": chunkExtraction,
    "choice-subset": choiceSubset,
    "local-prefix-helper": localPrefixHelper,
    "non-empty-tail-extraction": nonEmptyTailExtraction,
    "optional-body-extraction": optionalBodyExtraction,
    "optional-block-body-extraction": optionalBlockBodyExtraction,
    "literal-compound-alias-boundary": literalCompoundAliasBoundary,
    "leading-keyword-field-boundary": leadingKeywordFieldBoundary,
    "nested-field-body-extraction": nestedFieldBodyExtraction,
    "optional-flag-marker-prefix": optionalFlagMarkerPrefix,
    "prefix-extraction": prefixExtraction,
    "single-use-choice": singleUseChoice,
    "single-use-shared-choice-inline": singleUseSharedChoiceInline,
    "multi-use-private-choice-inline": multiUsePrivateChoiceInline,
    "shared-lexical-field-sequence-inline": sharedLexicalFieldSequenceInline,
    "multi-use-private-keyword-choice-inline": multiUsePrivateKeywordChoiceInline,
    "multi-use-private-keyword-alias-choice-inline": multiUsePrivateKeywordAliasChoiceInline,
    "multi-use-private-keyword-field-inline": multiUsePrivateKeywordFieldInline,
    "shared-keyword-inline": sharedKeywordInline,
    "single-use-shared-sequence-inline": singleUseSharedSequenceInline,
    "shared-keyword-alias-choice-inline": sharedKeywordAliasChoiceInline,
    "common-suffix-head-extraction": commonSuffixHeadExtraction,
    "shared-precedence-sequence-inline": sharedPrecedenceSequenceInline,
    "shared-closing-delimiter-inline": sharedClosingDelimiterInline,
    "shared-keyword-field-inline": sharedKeywordFieldInline,
    recurse: preferRecursion,
    "shared-sequence": sharedSequence,
    "shared-recursion": sharedRecursion,
    "shared-repetition": sharedRepetition,
    "single-use-sequence": singleUseSequence,
    "single-use-keyword-sequence": singleUseKeywordSequence,
    "single-use-precedence": singleUsePrecedence,
    "forwarding-rule": forwardingRule,
    "sequence-subset": sequenceSubset,
    "recursive-tail-reuse": recursiveTailReuse,
    "recursive-body-reuse": recursiveBodyReuse,
    "list-head-extraction": listHeadExtraction,
    "keyword-reuse": keywordReuse,
    "inline-keyword-owner": inlineKeywordOwner,
    "shared-choice": sharedChoice,
    "tail-extraction": tailExtraction,
    "token-packing": tokenPacking,
  },
};
