// Definition modifier helpers for ABL grammar
// Usage: seq(kw("DEFINE"), ...definitionModifiers(kw, { access: ['PRIVATE'], scope: ['SHARED'], static: true }), kw("BUFFER"), ...)

/**
 * Creates definition modifier rule fragments that can be spread into a sequence.
 * Modifiers are returned in order: new -> scope -> access -> static -> serializable -> abstract -> override
 *
 * @param {Function} kw - The keyword helper function
 * @param {Object} options - Configuration options
 * @param {string[]} options.access - Access levels as explicit array (e.g., ['PRIVATE', 'PROTECTED'])
 * @param {boolean} options.new - Include NEW prefix for scope (default: true)
 * @param {string[]} options.scope - Scope types (e.g., ['SHARED', 'GLOBAL'])
 * @param {boolean} options.static - Include STATIC modifier
 * @param {boolean} options.serializable - Include SERIALIZABLE/NON-SERIALIZABLE modifier
 * @param {boolean} options.abstract - Include ABSTRACT modifier (for events)
 * @param {boolean} options.override - Include OVERRIDE modifier (for events)
 * @returns {Array} Array of rule fragments to spread into seq()
 */
function definitionModifiers($, kw, options = {}) {
  const {
    new: hasNew = false,
    scope = [],
    access = [],
    static: hasStatic = false,
    serializable = false,
    abstract = false,
    override = false,
  } = options;

  const modifiers = [];

  // Scope modifiers (shared patterns)
  if (scope.length > 0) {
    const scopePatterns = [];

    if (hasNew && scope.includes("GLOBAL") && scope.includes("SHARED")) {
      scopePatterns.push(
        seq(
          alias(kw("NEW"), $.new_modifier),
          choice(
            alias(kw("GLOBAL"), $.scope_modifier),
            seq(
              alias(kw("GLOBAL"), $.scope_modifier),
              alias(kw("SHARED"), $.scope_modifier),
            ),
          ),
        ),
      );
    }

    if (hasNew && scope.includes("GLOBAL") && !scope.includes("SHARED")) {
      scopePatterns.push(
        seq(
          alias(kw("NEW"), $.new_modifier),
          alias(kw("GLOBAL"), $.scope_modifier),
        ),
      );
    }

    if (hasNew && scope.includes("SHARED")) {
      scopePatterns.push(
        seq(
          alias(kw("NEW"), $.new_modifier),
          alias(kw("SHARED"), $.scope_modifier),
        ),
      );
    }

    if (scope.includes("SHARED")) {
      scopePatterns.push(alias(kw("SHARED"), $.scope_modifier));
    }

    if (scopePatterns.length > 0) {
      modifiers.push(
        optional(
          scopePatterns.length > 1
            ? choice(...scopePatterns)
            : scopePatterns[0],
        ),
      );
    }
  }

  if (access.length > 0) {
    if (hasStatic)
      modifiers.push(optional(alias(kw("STATIC"), $.static_modifier)));
    if (abstract)
      modifiers.push(optional(alias(kw("ABSTRACT"), $.abstract_modifier)));
  }

  // Access modifiers
  if (access.length > 1) {
    modifiers.push(
      optional(
        choice(...access.map((level) => alias(kw(level), $.access_modifier))),
      ),
    );
  } else if (access.length === 1) {
    modifiers.push(optional(alias(kw(access[0]), $.access_modifier)));
  }

  if (hasStatic) {
    modifiers.push(optional(alias(kw("STATIC"), $.static_modifier)));
  }

  // Serializable modifier
  if (serializable) {
    modifiers.push(
      optional(
        choice(
          alias(kw("SERIALIZABLE"), $.serialization_modifier),
          alias(kw("NON-SERIALIZABLE"), $.serialization_modifier),
        ),
      ),
    );
  }

  // Abstract modifier
  if (abstract) {
    modifiers.push(optional(alias(kw("ABSTRACT"), $.abstract_modifier)));
  }

  // Override modifier
  if (override) {
    modifiers.push(optional(alias(kw("OVERRIDE"), $.override_modifier)));
  }

  return modifiers;
}

module.exports = {
  definitionModifiers,
};
