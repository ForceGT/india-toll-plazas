# Contributing to India Toll Plazas Dataset

Thank you for your interest in contributing to the India Toll Plazas Dataset! This project thrives on community contributions. Here's how you can help.

## Ways to Contribute

### 1. **Add State Highway Toll Data** (Most Valuable!)
The biggest impact is adding toll plazas from states not yet covered by NHAI data or that operate state highways.

- **See**: [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md)
- **Time**: 30 mins - 2 hours per state
- **Benefit**: Expands dataset coverage

### 2. **Report Data Issues**
Found incorrect toll rates, missing information, or closed toll plazas?

- Open an issue with:
  - Toll plaza ID or name
  - What's wrong
  - Correct information
  - Source reference

### 3. **Improve Documentation**
- Fix typos or unclear instructions
- Add examples or use cases
- Improve schema documentation
- Translate documentation

### 4. **Code Improvements**
- Fix bugs in fetch scripts
- Optimize rate limiting
- Add better error handling
- Improve performance

### 5. **Community Help**
- Answer questions in Issues
- Help test new contributions
- Provide feedback on PRs
- Share use cases

## Getting Started

### Prerequisites
- Git
- GitHub account
- Node.js 16+
- Text editor

### Fork & Clone

```bash
# 1. Fork the repository on GitHub
# https://github.com/[original]/india-toll-plazas/fork

# 2. Clone your fork
git clone https://github.com/[your-username]/india-toll-plazas.git
cd india-toll-plazas

# 3. Add upstream remote
git remote add upstream https://github.com/[original]/india-toll-plazas.git

# 4. Create a feature branch
git checkout -b add-state-highways-maharashtra
```

## Contribution Guidelines

### Code of Conduct
- Be respectful and professional
- Assume good intent
- Welcome diverse perspectives
- Report code of conduct violations

### Commit Messages
Use clear, descriptive messages:

```bash
# Good
git commit -m "Add Maharashtra state highways toll data"
git commit -m "Fix rate limiting exponential backoff jitter"
git commit -m "Update toll rates for toll plaza 305"

# Avoid
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Make your changes**
   - Edit `data/sources/state_highways.json` for toll data
   - Edit documentation or code as needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "descriptive message"
   ```

4. **Push to your fork**
   ```bash
   git push origin your-branch-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "Compare & Pull Request"
   - Fill in PR template (if provided)
   - Describe what you added/changed

6. **Respond to review**
   - Address feedback
   - Push additional commits
   - Tag reviewers if needed

### PR Checklist for State Highway Data

Before submitting PR for toll plaza data:

- [ ] All required fields present or set to `null`
- [ ] Tollplaza IDs are unique (>= 2000 for state highways)
- [ ] Field names use snake_case
- [ ] State names are UPPERCASE
- [ ] Coordinates are valid decimal format
- [ ] Toll rates are strings (e.g., "50" not 50)
- [ ] JSON is valid (no syntax errors)
- [ ] Data sources cited in PR description
- [ ] No personal information exposed
- [ ] No trailing whitespace or formatting issues

### PR Checklist for Code Changes

- [ ] Code follows Node.js style conventions
- [ ] All scripts are executable
- [ ] No console.log spam (use meaningful logging)
- [ ] Error handling is proper
- [ ] Changes tested locally
- [ ] Documentation updated if needed

## Data Contributing Tips

### Finding Toll Plaza Information

**Best sources:**
1. State PWD/Highway Authority websites
2. State toll portal/apps
3. FASTag aggregator platforms
4. Toll operator websites
5. News articles about toll rate changes
6. Direct surveys (your road trips!)

**Verify accuracy:**
- Use Google Maps to verify coordinates
- Cross-reference multiple sources for rates
- Document data source in your PR

### Starting with Your State

If you're from a particular state:
1. Check if state highway toll data exists in `data/sources/state_highways.json`
2. If not, research toll plazas in that state
3. Collect at least name, location, and basic rates
4. Follow format from [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md)
5. Submit PR

### Large Contributions

For adding many plazas or states:
1. **Open an issue first** to discuss
2. **Create intermediate commits** (one state per commit is good)
3. **Keep PRs focused** - better to have 5 PRs than 1 massive PR
4. **Document your sources** clearly

## Communication

### Questions?
- Open a GitHub Issue
- Check existing discussions
- Review documentation first

### Ideas?
- Open an issue with `[idea]` or `[discussion]` tag
- Get community feedback
- Discuss before major changes

### Found a Bug?
- Open an issue with `[bug]` tag
- Provide steps to reproduce
- Include error messages/logs

## Recognition

Contributors will be:
- Listed in project documentation
- Credited in release notes
- Recognized in the GitHub contributors page

## Legal

By contributing, you agree that:
- Your contribution can be licensed under the Government Open Data License
- You have the right to contribute the code/data
- You're not violating anyone's rights

## Development Workflow

### Testing Your Changes

```bash
# Test data fetch (requires NHAI API access)
node scripts/fetchNhaiTollplazas.js

# Test NHAI processing
node scripts/processNhai.js

# Test state highways processing
node scripts/processStateHighways.js

# Run full pipeline
./fetch-and-process.sh
```

### Validating JSON

```bash
# Check if JSON is valid
node -e "JSON.parse(require('fs').readFileSync('data/sources/state_highways.json'))"

# Or using jq
jq empty data/sources/state_highways.json
```

## Best Practices

✅ **Do:**
- Test your changes locally
- Document what you're adding
- Cite data sources
- Keep commits focused
- Ask questions if unclear
- Review others' PRs
- Be patient (reviews take time)

❌ **Don't:**
- Push directly to master (unless you're maintainer)
- Mix multiple unrelated changes in one PR
- Commit node_modules or build artifacts
- Add copyrighted data without permission
- Make large formatting changes with content changes
- Ignore PR feedback

## Questions?

- Check [README.md](./README.md) for project overview
- Check [SCHEMA.md](./SCHEMA.md) for data format
- Check [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md) for contribution specifics
- Open an issue if stuck

## License

All contributions are licensed under the Government Open Data License.

---

**Thank you for making India's toll plaza data accessible to everyone!** 🙏
