const createBrowserless = require("browserless");
const getHTML = require("html-get");
const child_process = require("child_process");
const glob = require("glob");
const fs = require("fs");

// Spawn Chromium process once
const browserlessFactory = createBrowserless();

const main = async () => {
  // Start the dev server
  await startDevServer();

  // Kill the process when Node.js exit
  process.on("exit", () => {
    console.log("closing resources!");
    browserlessFactory.close();
  });

  const routesDirGlob = glob.globSync("src/routes/**/*.hbs", {
    eager: true,
  });
  const apiRoutesDirGlob = glob.globSync("src/api/**/*.ts", {
    eager: true,
  });

  const allRoutesMerged = [...routesDirGlob, ...apiRoutesDirGlob];

  // create output directory if not present
  fs.mkdirSync("out", { recursive: true });

  // generate static site

  for (const route of allRoutesMerged) {
    try {
      /** @type {string} */
      const pathName = route
        .replace("src/", "")
        .replace(".hbs", "")
        .replace(".ts", "")
        .replace("routes/", "");

      const content = await getContent("http://localhost:3000");

      if (!pathName.includes("api") && content) {
        let newContent = content.html;

        const apiReferences = newContent.match(/\/api\/\w+/g);

        if (apiReferences) {
          for (const apiReference of apiReferences) {
            newContent = newContent.replace(
              apiReference,
              `${apiReference}.json`,
            );
          }
        }

        if (pathName.includes("/")) {
          // create inner directories if not present
          fs.mkdirSync(`out/${pathName.replace("index", "")}`, {
            recursive: true,
          });
        }
        const fileName = `${pathName}.html`;
        fs.writeFileSync(`out/${fileName}`, newContent);
      } else {
        if (pathName.includes("/")) {
          // create inner directories if not present
          fs.mkdirSync(`out/${pathName.replace("index", "")}`, {
            recursive: true,
          });
        }
        const fileName = `${pathName}.json`;
        fs.writeFileSync(`out/${fileName}`, String(content.json));
      }

      // copy over assets from public into out
      const publicDirGlob = glob.globSync("public/**/*", {
        eager: true,
      });

      for (const publicDir of publicDirGlob) {
        const pathName = publicDir.replace("public/", "");

        fs.cpSync(publicDir, `out/${pathName}`, {
          recursive: true,
        });

        console.log(`Copied ${publicDir} to out/${pathName}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  await stopDevServer();
};
main();

async function startDevServer() {
  child_process.exec("pnpm run dev", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
}

function stopDevServer() {
  child_process.exec(
    "lsof -i :3000 | grep LISTEN | awk '{print $2}'",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return process.exit();
      }

      child_process.exec(`kill ${stdout}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return process.exit();
        }
        return process.exit();
      });
      return process.exit();
    },
  );
}

async function getContent(url) {
  // create a browser context inside Chromium process
  const browserContext = browserlessFactory.createContext();
  const getBrowserless = () => browserContext;
  const result = await getHTML(url, { getBrowserless });
  // close the browser context after it's used
  await getBrowserless((browser) => browser.destroyContext());
  return result;
}
