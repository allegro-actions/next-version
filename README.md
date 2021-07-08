[![CI](https://github.com/allegro-actions/next-version/actions/workflows/ci.yml/badge.svg)](https://github.com/allegro-actions/next-version/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/allegro-actions/next-version/branch/main/graph/badge.svg?token=YJ3Z8ZKL2F)](https://codecov.io/gh/allegro-actions/next-version)

# allegro-actions/next-version

This action calculates next version based on last found version tag.

Supports semver tags and custom formats. Appends branch name to `-SNAPSHOT` releases by default.

## Outputs

`version` - computed next version

## Basic usage:

```yaml
- name: get next version
  id: 'bump'
  uses: allegro-actions/next-version@v1

- name: git tag
    if: github.ref == 'refs/heads/master'
    run: |
      git tag ${{ steps.bump.outputs.version }}
      git push origin HEAD --tags
  ```

## Configuration

You can change incrementing function to change patch/minor/major version.

```yaml
- name: get next version
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    step: 'minor'
  ```

You can also force next version.

```yaml
- name: get next version
  id: 'bump'
  uses: allegro-actions/next-version@v1
  with:
    force: '4.0.0'
  ```

**Parameter force will be ignored if not valid version string provided.**

## Use cases

### Adding manual control

i.e. adding workflow input parameter to force version release manually:

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
      - name: get next version
        id: 'bump'
        uses: allegro-actions/next-version@v1
        with:
          force: ${{ github.event.inputs.forceVersion }}
  ```