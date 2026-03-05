[![CI](https://github.com/allegro-actions/next-version/actions/workflows/ci.yml/badge.svg)](https://github.com/allegro-actions/next-version/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/allegro-actions/next-version/branch/main/graph/badge.svg?token=YJ3Z8ZKL2F)](https://codecov.io/gh/allegro-actions/next-version)
![Usage](https://shields.gh-stats.app/badge?action=allegro-actions/next-version)

# allegro-actions/next-version

This action calculates next tag based on git history.

To get the latest tag, it checks both the local history and the origin, which means you don't have to fetch the whole git history prior to running this action.

Supports semver/calver tags and custom formats.

## Outputs

`current_tag` - latest found version tag
`next_tag` - computed next tag
`next_version` - computed next version

## Basic usage:

```yaml
- name: get next version
  id: 'bump'
  uses: allegro-actions/next-version@v1
xczxv
- name: Push new tag on master
  if: github.ref == 'refs/heads/master'
  uses: allegro-actions/create-tag@v1
  with:
    tag: ${{ steps.bump.outputs.next_tag }}
    current-tag: ${{ steps.bump.outputs.current_tag }}
  ```

Will output v1.0.1 (assuming v1.0.0 tag exists)

## Configuration

### prefix

You can change prefix to handle **my-app-1.0.0** tag

```yaml
- name: get next tag
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    prefix: 'my-app-'
  ```

Will output **my-app-1.0.1** (assuming my-app-1.0.0 tag exists)

### versioning

You can set versioning to change the version format.

Supported values: `semver` (default), `single-number`, `calver`.

#### single-number

```yaml
- name: get next tag
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    versioning: 'single-number'
  ```

Will output **v2** (assuming v1 tag exists)

Will output **v1** if no previous tag found.

#### calver

Calendar versioning uses the current date to determine the version. The format is `YEAR.MONTH.MICRO`, where the micro number auto-increments within the same month and resets to 0 when the month changes.

```yaml
- name: get next tag
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    versioning: 'calver'
  ```

Will output **v2025.3.0** if no previous tag found (assuming current date is March 2025).

Will output **v2025.3.1** (assuming v2025.3.0 tag exists and current date is March 2025).

Will output **v2025.4.0** (assuming v2025.3.5 tag exists and current date is April 2025 — micro resets on month change).

### calver-format

You can customize the calver format. Supported formats:

| Format | Example |
|---|---|
| `YYYY.MM.MICRO` (default) | `2025.3.0` |
| `YY.MM.MICRO` | `25.3.0` |
| `YYYY.0M.MICRO` | `2025.03.0` |
| `YY.0M.MICRO` | `25.03.0` |

```yaml
- name: get next tag
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    versioning: 'calver'
    calver-format: 'YY.0M.MICRO'
  ```

Will output **v25.03.0** if no previous tag found (assuming current date is March 2025).

### force

You can also force next version.

```yaml
- name: get next tag
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    force: '4.0.0'
  ```

Will always output **v4.0.0**

## Use cases

### Adding manual control

i.e. adding workflow input parameter to force next tag manually:

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      forceVersion:
        description: 'Force version'
        required: false
        default: ''
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: get next tag
        id: 'bump'
        uses: allegro-actions/next-version@v1
        with:
          force: ${{ github.event.inputs.forceVersion }}
  ```
