# dist-tagger

A tool for not wasting time manually typing out dist-tag commands.

## Usage

`dist-tagger <op> <configFile> [tag]`

Requires a JSON file that gives the package list in
this format:
```
{
  tag: "foo-bar",
  packages: [
    sample@1.2.3,
    otherSample@2.4.6
  ]
}
```

## Operations

### add
add a dist-tag to all of the packages in <configFile>
### rm
rm a dist-tag from all of the packages in <configFile>
### view
view all of the dist-tags for packages in <configFile>
