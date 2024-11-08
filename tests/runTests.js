// tests/runTests.js

const { exec } = require('child_process');
const fs = require('fs');

async function runTests() {
    console.log('Starting automated test suite...');
    
    // Create test report directory if it doesn't exist
    if (!fs.existsSync('./test-reports')) {
        fs.mkdirSync('./test-reports');
    }

    const timestamp = new Date().toISOString().replace(/:/g, '-');
    
    try {
        // Run tests with coverage and output to file
        const testCommand = `jest --coverage --json --outputFile=./test-reports/results-${timestamp}.json`;
        
        exec(testCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Test execution failed:', error);
                process.exit(1);
            }

            console.log(stdout);

            // Parse test results
            const results = require(`../test-reports/results-${timestamp}.json`);
            
            // Generate summary
            const summary = {
                timestamp: timestamp,
                totalTests: results.numTotalTests,
                passedTests: results.numPassedTests,
                failedTests: results.numFailedTests,
                coverage: results.coverageMap
            };

            // Write summary to file
            fs.writeFileSync(
                `./test-reports/summary-${timestamp}.json`,
                JSON.stringify(summary, null, 2)
            );

            console.log('\nTest Summary:');
            console.log(`Total Tests: ${summary.totalTests}`);
            console.log(`Passed: ${summary.passedTests}`);
            console.log(`Failed: ${summary.failedTests}`);
            
            // Exit with failure if any tests failed
            if (summary.failedTests > 0) {
                process.exit(1);
            }
        });
    } catch (err) {
        console.error('Error running tests:', err);
        process.exit(1);
    }
}

runTests();
