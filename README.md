A simple website to compare [AdventOfCode](https://adventofcode.com/) solutions between members of the [Undergraduate Project Lab](https://upl.cs.wisc.edu) at the University of Wisconsin-Madison.

Blatantly inspired by [CAU CS's submission comparison tool](https://github.com/melfkammholz/aoc-submissions).

## Setup

1. Clone the repository with `git clone https://github.com/fallow64/aoc-submissions.git`
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory with the following content:
   ```
   GITHUB_TOKEN=your_github_token_here
   ```

## Usage

1. Development server

Run `npm run dev` to start the development server. Open `localhost:3000` in your browser to view the application.

2. Build for production

Run `npm run build` to build the application for production. The output will be in the `out` directory.

To serve the built application, run `npm run start` and open `localhost:3000` in your browser.

## TODO

- [ ] Backend service that automatically caches / refetches submissions automatically
- [ ] If a file contains part A and B, highlight the method of the selected part
- [ ] UI improvements (more compact)
- [ ] Reword title/description
