# verilog-formatter

[![Build Status](https://travis-ci.com/IsaacJT/Verilog-Formatter.svg?branch=master)](https://travis-ci.com/IsaacJT/Verilog-Formatter)

This is an extension for VSCode which provides a wrapper to the iStyle Verilog code formatter.

## Requirements

- "Verilog HDL/SystemVerilog" extension for VSCode (mshr-h.veriloghd) for Verilog language support
- Download and install the latest version of the iStyle formatter (tested with v1.21), and either add it to your PATH or configure the path to the executable using the appropriate configuration setting in VSCode

## Features

- You can configure the formatting style to one of the following which are supported by iStyle:
  - K&R
  - ANSI
  - GNU
  - Indent only (no formatting), default
