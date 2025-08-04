#!/usr/bin/env node

/**
 * AI-Context Documentation Validation Script
 * 
 * This script validates the completeness and quality of AI-Context Documentation
 * by checking for required files, content quality, and structural integrity.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  requiredFiles: [
    'INDEX.md',
    'README.md',
    'architecture-overview.md',
    'data-models.md'
  ],
  optionalFiles: [
    'components.md',
    'api-documentation.md',
    'deployment-guide.md',
    'development-workflow.md',
    'known-issues.md',
    'performance-guide.md',
    'security-guide.md',
    'roadmap.md'
  ],
  minFileSize: 1000, // Minimum file size in bytes
  requiredSections: [
    '## 🎯',
    '## 📋',
    '## 🔍',
    '## 📊'
  ],
  qualityChecks: {
    hasCodeExamples: true,
    hasFilePaths: true,
    hasTimestamps: true,
    hasCrossReferences: true
  }
};

class DocumentationValidator {
  constructor(docsPath = 'cursor-docs') {
    this.docsPath = docsPath;
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      requiredFiles: 0,
      optionalFiles: 0,
      missingFiles: 0,
      qualityIssues: 0
    };
  }

  /**
   * Main validation function
   */
  async validate() {
    console.log('🔍 Validating AI-Context Documentation...\n');
    
    if (!this.docsPathExists()) {
      this.addError(`Documentation directory '${this.docsPath}' not found`);
      return this.generateReport();
    }

    await this.checkRequiredFiles();
    await this.checkOptionalFiles();
    await this.validateContentQuality();
    await this.checkCrossReferences();
    
    return this.generateReport();
  }

  /**
   * Check if documentation directory exists
   */
  docsPathExists() {
    return fs.existsSync(this.docsPath);
  }

  /**
   * Check for required files
   */
  async checkRequiredFiles() {
    console.log('📋 Checking required files...');
    
    for (const file of CONFIG.requiredFiles) {
      const filePath = path.join(this.docsPath, file);
      
      if (fs.existsSync(filePath)) {
        this.stats.requiredFiles++;
        console.log(`  ✅ ${file}`);
        
        // Check file size
        const stats = fs.statSync(filePath);
        if (stats.size < CONFIG.minFileSize) {
          this.addWarning(`${file} is too small (${stats.size} bytes). Consider adding more content.`);
        }
      } else {
        this.stats.missingFiles++;
        this.addError(`Required file missing: ${file}`);
        console.log(`  ❌ ${file} (MISSING)`);
      }
    }
  }

  /**
   * Check for optional files
   */
  async checkOptionalFiles() {
    console.log('\n📋 Checking optional files...');
    
    for (const file of CONFIG.optionalFiles) {
      const filePath = path.join(this.docsPath, file);
      
      if (fs.existsSync(filePath)) {
        this.stats.optionalFiles++;
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ⚪ ${file} (not present)`);
      }
    }
  }

  /**
   * Validate content quality
   */
  async validateContentQuality() {
    console.log('\n🔍 Validating content quality...');
    
    const allFiles = [...CONFIG.requiredFiles, ...CONFIG.optionalFiles];
    
    for (const file of allFiles) {
      const filePath = path.join(this.docsPath, file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        await this.validateFileContent(file, content);
      }
    }
  }

  /**
   * Validate individual file content
   */
  async validateFileContent(filename, content) {
    const issues = [];

    // Check for required sections
    const hasRequiredSections = CONFIG.requiredSections.some(section => 
      content.includes(section)
    );
    
    if (!hasRequiredSections) {
      issues.push('Missing required sections (🎯, 📋, 🔍, 📊)');
    }

    // Check for code examples
    if (CONFIG.qualityChecks.hasCodeExamples && !content.includes('```')) {
      issues.push('No code examples found');
    }

    // Check for file paths
    if (CONFIG.qualityChecks.hasFilePaths && !content.includes('src/') && !content.includes('path/')) {
      issues.push('No file paths found');
    }

    // Check for timestamps
    if (CONFIG.qualityChecks.hasTimestamps && !content.includes('Last Updated') && !content.includes('2024-')) {
      issues.push('No timestamps found');
    }

    // Check for cross-references
    if (CONFIG.qualityChecks.hasCrossReferences && !content.includes('.md')) {
      issues.push('No cross-references found');
    }

    if (issues.length > 0) {
      this.stats.qualityIssues++;
      this.addWarning(`${filename}: ${issues.join(', ')}`);
    } else {
      console.log(`  ✅ ${filename} (quality check passed)`);
    }
  }

  /**
   * Check cross-references between files
   */
  async checkCrossReferences() {
    console.log('\n🔗 Checking cross-references...');
    
    const allFiles = [...CONFIG.requiredFiles, ...CONFIG.optionalFiles];
    const existingFiles = allFiles.filter(file => 
      fs.existsSync(path.join(this.docsPath, file))
    );

    for (const file of existingFiles) {
      const filePath = path.join(this.docsPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find all markdown links
      const markdownLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
      
      for (const link of markdownLinks) {
        const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const linkText = match[1];
          const linkPath = match[2];
          
          // Check if internal link exists
          if (linkPath.endsWith('.md') && !linkPath.startsWith('http')) {
            const targetPath = path.join(this.docsPath, linkPath);
            if (!fs.existsSync(targetPath)) {
              this.addWarning(`${file}: Broken link to ${linkPath}`);
            }
          }
        }
      }
    }
  }

  /**
   * Add error to validation results
   */
  addError(message) {
    this.errors.push(message);
  }

  /**
   * Add warning to validation results
   */
  addWarning(message) {
    this.warnings.push(message);
  }

  /**
   * Generate validation report
   */
  generateReport() {
    console.log('\n📊 Validation Report');
    console.log('==================');
    
    // Summary
    this.stats.totalFiles = this.stats.requiredFiles + this.stats.optionalFiles;
    const coverage = this.stats.requiredFiles / CONFIG.requiredFiles.length * 100;
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total files: ${this.stats.totalFiles}`);
    console.log(`  Required files: ${this.stats.requiredFiles}/${CONFIG.requiredFiles.length}`);
    console.log(`  Optional files: ${this.stats.optionalFiles}`);
    console.log(`  Missing files: ${this.stats.missingFiles}`);
    console.log(`  Quality issues: ${this.stats.qualityIssues}`);
    console.log(`  Coverage: ${coverage.toFixed(1)}%`);

    // Errors
    if (this.errors.length > 0) {
      console.log(`\n❌ Errors (${this.errors.length}):`);
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    
    if (this.stats.missingFiles > 0) {
      console.log('  - Create missing required files');
    }
    
    if (this.stats.qualityIssues > 0) {
      console.log('  - Improve content quality in flagged files');
    }
    
    if (this.stats.optionalFiles < 3) {
      console.log('  - Consider adding more optional documentation files');
    }
    
    if (coverage < 100) {
      console.log('  - Complete all required documentation files');
    }

    // Overall status
    const hasErrors = this.errors.length > 0;
    const hasWarnings = this.warnings.length > 0;
    
    if (hasErrors) {
      console.log('\n🔴 Validation FAILED - Fix errors before proceeding');
      process.exit(1);
    } else if (hasWarnings) {
      console.log('\n🟡 Validation PASSED with warnings - Consider addressing warnings');
      process.exit(0);
    } else {
      console.log('\n🟢 Validation PASSED - Documentation is ready!');
      process.exit(0);
    }
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const docsPath = args[0] || 'cursor-docs';
  
  const validator = new DocumentationValidator(docsPath);
  await validator.validate();
}

// Run validation if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  });
}

module.exports = DocumentationValidator; 