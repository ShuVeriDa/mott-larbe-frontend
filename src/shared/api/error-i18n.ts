const ERROR_CODE_TO_I18N_KEY: Record<string, string> = {
  // Generic
  INTERNAL_SERVER_ERROR: "apiErrors.internalServerError",
  ACCESS_DENIED: "apiErrors.accessDenied",

  // Auth
  INVALID_REFRESH_TOKEN: "apiErrors.invalidRefreshToken",
  INVALID_TOKEN_TYPE: "apiErrors.invalidTokenType",
  REFRESH_TOKEN_REVOKED: "apiErrors.refreshTokenRevoked",
  SESSION_REVOKED: "apiErrors.sessionRevoked",
  INVALID_PASSWORD: "apiErrors.invalidPassword",
  INVALID_CURRENT_PASSWORD: "apiErrors.invalidCurrentPassword",
  REFRESH_TOKEN_NOT_PASSED: "apiErrors.refreshTokenNotPassed",
  TOKEN_REVOKED: "apiErrors.tokenRevoked",
  TOKEN_EXPIRED: "apiErrors.tokenExpired",
  TOKEN_USED: "apiErrors.tokenUsed",
  TOKEN_INVALID: "apiErrors.tokenInvalid",
  ACCOUNT_UNAVAILABLE: "apiErrors.accountUnavailable",
  ACCOUNT_SCHEDULED_FOR_DELETION: "apiErrors.accountScheduledForDeletion",
  ACCOUNT_BLOCKED: "apiErrors.accountBlocked",
  PASSWORD_NOT_SET: "apiErrors.passwordNotSet",
  LAST_LOGIN_METHOD: "apiErrors.lastLoginMethod",
  ACCOUNT_NOT_FOUND: "apiErrors.accountNotFound",
  ACCOUNT_ALREADY_LINKED: "apiErrors.accountAlreadyLinked",

  // User
  USER_NOT_FOUND: "apiErrors.userNotFound",
  USER_ALREADY_EXISTS: "apiErrors.userAlreadyExists",
  USERNAME_TAKEN: "apiErrors.usernameTaken",
  EMAIL_TAKEN: "apiErrors.emailTaken",
  EMAIL_MISMATCH: "apiErrors.emailMismatch",
  ALREADY_SCHEDULED_FOR_DELETION: "apiErrors.alreadyScheduledForDeletion",
  SAME_PASSWORD: "apiErrors.samePassword",
  SAME_EMAIL: "apiErrors.sameEmail",
  AVATAR_TOO_LARGE: "apiErrors.avatarTooLarge",
  INVALID_AVATAR_TYPE: "apiErrors.invalidAvatarType",

  // Subscription
  NO_ACTIVE_SUBSCRIPTION: "apiErrors.noActiveSubscription",
  ALREADY_SUBSCRIBED: "apiErrors.alreadySubscribed",
  SUBSCRIPTION_REQUIRED: "apiErrors.subscriptionRequired",
  SUBSCRIPTION_EXPIRED: "apiErrors.subscriptionExpired",
  USE_DELETE_TO_DOWNGRADE: "apiErrors.useDeleteToDowngrade",
  TRIAL_NOT_APPLICABLE: "apiErrors.trialNotApplicable",
  TRIAL_NOT_AVAILABLE: "apiErrors.trialNotAvailable",
  TRIAL_ALREADY_USED: "apiErrors.trialAlreadyUsed",
  ALREADY_HAS_ACTIVE_SUBSCRIPTION: "apiErrors.alreadyHasActiveSubscription",
  MANUAL_BILLING_DISABLED: "apiErrors.manualBillingDisabled",
  PLAN_ID_OR_CODE_REQUIRED: "apiErrors.planIdOrCodeRequired",
  PLAN_ID_AND_CODE_CONFLICT: "apiErrors.planIdAndCodeConflict",
  PLAN_NOT_FOUND: "apiErrors.planNotFound",

  // Promo / Coupon
  PROMO_NOT_FOUND: "apiErrors.promoNotFound",
  PROMO_NOT_YET_VALID: "apiErrors.promoNotYetValid",
  PROMO_EXPIRED: "apiErrors.promoExpired",
  PROMO_LIMIT_REACHED: "apiErrors.promoLimitReached",
  PROMO_ALREADY_REDEEMED: "apiErrors.promoAlreadyRedeemed",
  COUPON_NOT_FOUND: "apiErrors.couponNotFound",
  COUPON_NOT_ACTIVE_YET: "apiErrors.couponNotActiveYet",
  COUPON_EXPIRED: "apiErrors.couponExpired",
  COUPON_LIMIT_REACHED: "apiErrors.couponLimitReached",
  COUPON_PER_USER_LIMIT_REACHED: "apiErrors.couponPerUserLimitReached",
  COUPON_ALREADY_REDEEMED: "apiErrors.couponAlreadyRedeemed",
  COUPON_INVALID: "apiErrors.couponInvalid",
  COUPON_NOT_ACTIVE: "apiErrors.couponNotActive",
  COUPON_CANNOT_DELETE_REDEEMED: "apiErrors.couponCannotDeleteRedeemed",

  // Dictionary
  DICTIONARY_ENTRY_NOT_FOUND: "apiErrors.dictionaryEntryNotFound",
  FOLDER_NOT_FOUND: "apiErrors.folderNotFound",
  FOLDER_ALREADY_EXISTS: "apiErrors.folderAlreadyExists",
  VOCABULARY_LIMIT_REACHED: "apiErrors.vocabularyLimitReached",
  FOLDER_LIMIT_REACHED: "apiErrors.folderLimitReached",
  FOLDERS_NOT_AVAILABLE: "apiErrors.foldersNotAvailable",
  ENTRIES_NOT_BELONG_TO_USER: "apiErrors.entriesNotBelongToUser",
  FOLDERS_NOT_BELONG_TO_USER: "apiErrors.foldersNotBelongToUser",
  FOLDER_NOT_BELONG_TO_USER: "apiErrors.folderNotBelongToUser",
  WORD_OR_TOKEN_REQUIRED: "apiErrors.wordOrTokenRequired",
  TRANSLATION_OR_TOKEN_REQUIRED: "apiErrors.translationOrTokenRequired",
  TOKEN_MISSING_WORD_OR_TRANSLATION: "apiErrors.tokenMissingWordOrTranslation",
  DUPLICATE_FOLDER_ORDER_IDS: "apiErrors.duplicateFolderOrderIds",
  FOLDER_ORDER_IDS_MISMATCH: "apiErrors.folderOrderIdsMismatch",

  // AI Translation
  GEMINI_KEY_NOT_CONFIGURED: "apiErrors.geminiKeyNotConfigured",
  GEMINI_PARSE_ERROR: "apiErrors.geminiParseError",
  NOT_CHECHEN: "apiErrors.notChechen",
  LOCATION_NOT_SUPPORTED: "apiErrors.locationNotSupported",
  GEMINI_ERROR: "apiErrors.geminiError",
  DAILY_TRANSLATION_LIMIT_REACHED: "apiErrors.dailyTranslationLimitReached",
  AI_CACHE_ENTRY_NOT_FOUND: "apiErrors.aiCacheEntryNotFound",
  ADMIN_GEMINI_KEY_NOT_CONFIGURED: "apiErrors.adminGeminiKeyNotConfigured",

  // Text / Reader
  TEXT_NOT_FOUND: "apiErrors.textNotFound",
  PAGE_NOT_FOUND: "apiErrors.pageNotFound",
  TEXT_PAGE_NOT_FOUND: "apiErrors.textPageNotFound",
  TEXT_HAS_NO_PAGES: "apiErrors.textHasNoPages",
  INVALID_PAGE_NUMBER: "apiErrors.invalidPageNumber",
  ALREADY_REPORTED_TEXT: "apiErrors.alreadyReportedText",

  // Deck / Cards
  LEMMA_NOT_FOUND: "apiErrors.lemmaNotFound",
  CARD_NOT_FOUND: "apiErrors.cardNotFound",

  // Feedback
  THREAD_NOT_FOUND: "apiErrors.threadNotFound",
  REACTION_NOT_FOUND: "apiErrors.reactionNotFound",
  FEEDBACK_PROVIDE_LEMMA_OR_TEXT: "apiErrors.feedbackProvideLemmaOrText",

  // Highlight / Note
  HIGHLIGHT_NOT_FOUND: "apiErrors.highlightNotFound",
  NOTE_NOT_FOUND: "apiErrors.noteNotFound",

  // Phrasebook
  PHRASE_NOT_FOUND: "apiErrors.phraseNotFound",

  // Token
  TOKEN_NOT_FOUND: "apiErrors.tokenNotFound",

  // Suggestions
  SUGGESTION_NOT_FOUND: "apiErrors.suggestionNotFound",
  SUGGESTION_FIELD_NOT_EDITABLE: "apiErrors.suggestionFieldNotEditable",
  SUGGESTION_PENDING_EXISTS: "apiErrors.suggestionPendingExists",
  SUGGESTION_ALREADY_REVIEWED: "apiErrors.suggestionAlreadyReviewed",
  SUGGESTION_INVALID_STATUS: "apiErrors.suggestionInvalidStatus",

  // Legal
  LEGAL_DOCUMENT_NOT_FOUND: "apiErrors.legalDocumentNotFound",
  LEGAL_DOCUMENT_ALREADY_EXISTS: "apiErrors.legalDocumentAlreadyExists",

  // Sessions
  SESSION_NOT_FOUND: "apiErrors.sessionNotFound",
  SESSION_ALREADY_REVOKED: "apiErrors.sessionAlreadyRevoked",

  // Markup engine / Dictionary admin
  LEMMA_ALREADY_LINKED: "apiErrors.lemmaAlreadyLinked",
  SENSE_REQUIRED_FOR_EXAMPLE: "apiErrors.senseRequiredForExample",
  EMPTY_IMPORT_PAYLOAD: "apiErrors.emptyImportPayload",
  CANNOT_DELETE_PRIMARY_HEADWORD: "apiErrors.cannotDeletePrimaryHeadword",
  CANNOT_UNSET_PRIMARY_HEADWORD: "apiErrors.cannotUnsetPrimaryHeadword",
  SENSE_NOT_FOUND: "apiErrors.senseNotFound",
  EXAMPLE_NOT_FOUND: "apiErrors.exampleNotFound",
  HEADWORD_NOT_FOUND: "apiErrors.headwordNotFound",
  MORPH_FORM_NOT_FOUND: "apiErrors.morphFormNotFound",

  // Admin: morphology
  LEMMA_ALREADY_EXISTS: "apiErrors.lemmaAlreadyExists",
  MORPH_FORM_ALREADY_EXISTS: "apiErrors.morphFormAlreadyExists",
  MORPH_RULE_ALREADY_EXISTS: "apiErrors.morphRuleAlreadyExists",
  MORPH_RULE_NOT_FOUND: "apiErrors.morphRuleNotFound",
  MORPHOLOGY_RULE_NOT_FOUND: "apiErrors.morphRuleNotFound",
  FILE_REQUIRED: "apiErrors.fileRequired",
  CSV_EMPTY: "apiErrors.csvEmpty",

  // Admin: tags
  TAG_ALREADY_EXISTS: "apiErrors.tagAlreadyExists",
  TAG_NOT_FOUND: "apiErrors.tagNotFound",

  // Admin: text
  ONLY_COMPLETED_CAN_RESTORE: "apiErrors.onlyCompletedCanRestore",
  VERSION_NOT_FOUND: "apiErrors.versionNotFound",
  TEXT_VERSION_NOT_FOUND: "apiErrors.versionNotFound",
  TEXT_VERSION_NOT_COMPLETED: "apiErrors.textVersionNotCompleted",
  TEXT_PHRASE_ALREADY_EXISTS: "apiErrors.textPhraseAlreadyExists",
  TEXT_NOT_TOKENIZED: "apiErrors.textNotTokenized",
  PHRASE_WORDS_NOT_FOUND: "apiErrors.phraseWordsNotFound",
  OCCURRENCE_NOT_FOUND: "apiErrors.occurrenceNotFound",
  PHRASE_OCCURRENCE_NOT_FOUND: "apiErrors.occurrenceNotFound",
  PHRASE_OCCURRENCE_ALREADY_EXISTS: "apiErrors.phraseOccurrenceAlreadyExists",

  // Admin: billing
  LIFETIME_CANNOT_EXTEND: "apiErrors.lifetimeCannotExtend",
  PAYMENT_FULLY_REFUNDED: "apiErrors.paymentFullyRefunded",
  PAYMENT_ALREADY_REFUNDED: "apiErrors.paymentAlreadyRefunded",
  INVALID_REFUND_AMOUNT: "apiErrors.invalidRefundAmount",
  PAYMENT_INVALID_REFUND_AMOUNT: "apiErrors.invalidRefundAmount",
  NO_RECIPIENT_EMAIL: "apiErrors.noRecipientEmail",
  PAYMENT_NO_RECIPIENT_EMAIL: "apiErrors.noRecipientEmail",
  COUPON_PERCENT_TOO_HIGH: "apiErrors.couponPercentTooHigh",
  COUPON_INVALID_AMOUNT: "apiErrors.couponInvalidAmount",
  PAYMENT_NOT_FOUND: "apiErrors.paymentNotFound",
  PLAN_CANNOT_DELETE_HAS_SUBSCRIPTIONS: "apiErrors.planCannotDeleteHasSubscriptions",
  USER_ID_OR_EMAIL_REQUIRED: "apiErrors.userIdOrEmailRequired",

  // Admin: feature flags
  FEATURE_FLAG_ALREADY_EXISTS: "apiErrors.featureFlagAlreadyExists",
  FEATURE_FLAG_NOT_FOUND: "apiErrors.featureFlagNotFound",
  FEATURE_FLAG_OVERRIDE_NOT_FOUND: "apiErrors.featureFlagOverrideNotFound",
  INVALID_IS_ENABLED_FILTER: "apiErrors.invalidIsEnabledFilter",
  INVALID_FILTER_VALUE: "apiErrors.invalidFilterValue",

  // Admin: roles
  CANNOT_REVOKE_BASE_ROLE: "apiErrors.cannotRevokeBaseRole",
  ROLE_NOT_FOUND: "apiErrors.roleNotFound",
  ROLE_ASSIGNMENT_NOT_FOUND: "apiErrors.roleAssignmentNotFound",
  USER_ALREADY_HAS_ROLE: "apiErrors.userAlreadyHasRole",
  USER_ROLE_ALREADY_ASSIGNED: "apiErrors.userAlreadyHasRole",
  SUBSCRIPTION_NOT_FOUND: "apiErrors.subscriptionNotFound",
  SUBSCRIPTION_ALREADY_CANCELED: "apiErrors.subscriptionAlreadyCanceled",
  SUBSCRIPTION_CANNOT_EXTEND_LIFETIME: "apiErrors.subscriptionCannotExtendLifetime",

  // Admin: unknown words
  UNKNOWN_WORD_NOT_FOUND: "apiErrors.unknownWordNotFound",

  // Admin: feedback
  CANNOT_TRANSFER_TO_SELF: "apiErrors.cannotTransferToSelf",
  FEEDBACK_CANNOT_TRANSFER_TO_SELF: "apiErrors.cannotTransferToSelf",
  ASSIGNEE_NOT_FOUND: "apiErrors.assigneeNotFound",
  TARGET_ADMIN_NOT_FOUND: "apiErrors.targetAdminNotFound",

  // Admin: tokenization
  NO_CURRENT_TOKENIZATION: "apiErrors.noCurrentTokenization",
  TEXT_VOCABULARY_NOT_FOUND: "apiErrors.textVocabularyNotFound",

  // Admin: phrasebook
  PHRASEBOOK_CATEGORY_NOT_FOUND: "apiErrors.phrasebookCategoryNotFound",
  PHRASEBOOK_PHRASE_NOT_FOUND: "apiErrors.phrasebookPhraseNotFound",
  PHRASE_SUGGESTION_NOT_FOUND: "apiErrors.phraseSuggestionNotFound",

  // Admin: system logs
  LOG_NOT_FOUND: "apiErrors.logNotFound",
};

export const getErrorI18nKey = (code: string): string =>
  ERROR_CODE_TO_I18N_KEY[code] ?? "apiErrors.internalServerError";
