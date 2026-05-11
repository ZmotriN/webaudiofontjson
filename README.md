![MidiAudioPlayer](https://zmotrin.github.io/midi-audio-player/images/logo.svg)


# WebAudioFontJSON

A high-performance, modular library for managing WebAudioFont data in JSON format, specifically optimized for browser-based MIDI synthesis.

## Core Features

* **Sparse-Checkout Integration**: Automated scripts selectively retrieve sound data while maintaining a minimal repository footprint.
* **Modern ES2022 Architecture**: Developed using asynchronous programming patterns and modular JavaScript standards.
* **Automated CI/CD**: Integrated GitHub Actions for automated distribution builds and deployment pipelines.
* **Optimized Web Audio**: Engineered for precise gain node management and low-latency audio processing.

## Installation

```bash
git clone https://github.com/ZmotriN/webaudiofontjson.git
cd webaudiofontjson
npm run build
```

## Technical Implementation

The project leverages a custom Node.js workflow to synchronize with the [webaudiofontdat](https://github.com/surikov/webaudiofontdata) repository by [Surikov](https://github.com/surikov). By utilizing sparse-checkout configurations, it extracts only the required `.js` instrument definitions, which are then processed for use in web-based audio engines and game frameworks.

## Catalog

Explore the full instrument collection through our interactive catalog at [https://zmotrin.github.io/webaudiofontjson/](https://zmotrin.github.io/webaudiofontjson/). This interface allows you to browse all available sound presets, preview audio samples in real-time, and access specific technical configurations for your MIDI projects.

## License

Distributed under the [MIT License](LICENSE). Developed in Montreal, Canada.