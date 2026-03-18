// Sequence state for @sequence fail-fast behavior
let sequenceState = {
  hasSequenceTag: false,
  sequenceFailed: false,
  currentScenario: null,
  allScenarios: [],
  scenarioIndex: 0,
  failedScenarioIndex: -1
}

// Setup serial sequence hooks for @sequence fail-fast behavior
export const setupSerialHooks = () => {
  // Before running any spec, check if it has @sequence tag
  before(function() {
    const specPath = Cypress.spec.relative

    cy.task('checkSequenceFile', specPath).then((result) => {
      sequenceState.hasSequenceTag = result.hasSequenceTag
      sequenceState.allScenarios = result.scenarios || []
      sequenceState.sequenceFailed = false
      sequenceState.scenarioIndex = 0
      sequenceState.failedScenarioIndex = -1

      // Update the global state in plugins
      cy.task('setSequenceState', {
        currentFile: specPath,
        hasSequenceTag: sequenceState.hasSequenceTag,
        sequenceFailed: false,
        sequenceScenarios: sequenceState.allScenarios
      })
    })
  })

  // Before each scenario, check if it should be skipped due to previous failure
  beforeEach(function() {
    const currentScenarioName = this.currentTest?.title ||
                               this.test?.title ||
                               Cypress.currentTest?.title ||
                               'Unknown Scenario'

    if (!sequenceState.hasSequenceTag) {
      return // Not a sequence feature, proceed normally
    }

    sequenceState.currentScenario = currentScenarioName
    sequenceState.scenarioIndex++

    // In feature-level @sequence, skip only scenarios that come AFTER the failed one
    if (sequenceState.sequenceFailed && sequenceState.scenarioIndex > sequenceState.failedScenarioIndex) {
      // Mark as skipped
      this.currentTest.pending = true
      this.currentTest.state = 'pending'
      this.skip()
    }
  })

  // After each scenario, check if it failed and update sequence state
  afterEach(function() {
    const testState = this.currentTest?.state

    // Get retry information from Cypress
    const currentRetryAttempt = this.currentTest?._currentRetry || 0
    const maxRetries = this.currentTest?._retries || 0
    const isLastAttempt = currentRetryAttempt >= maxRetries

    if (!sequenceState.hasSequenceTag) {
      return // Not a sequence feature, proceed normally
    }

    // Only mark sequence as failed if this test actually failed AND all retries are exhausted
    if (testState === 'failed' && !this.currentTest.pending && isLastAttempt) {
      sequenceState.sequenceFailed = true
      sequenceState.failedScenarioIndex = sequenceState.scenarioIndex

      // Update global state
      cy.task('setSequenceState', {
        sequenceFailed: true
      })
    }
  })

  // Reset sequence state after all tests in the spec
  after(function() {
    if (sequenceState.hasSequenceTag) {
      sequenceState = {
        hasSequenceTag: false,
        sequenceFailed: false,
        currentScenario: null,
        allScenarios: [],
        scenarioIndex: 0,
        failedScenarioIndex: -1
      }

      cy.task('setSequenceState', {
        currentFile: null,
        hasSequenceTag: false,
        sequenceFailed: false,
        sequenceScenarios: []
      })
    }
  })
}
