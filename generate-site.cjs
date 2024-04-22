const getHTML = require("html-get");
const child_process = require("child_process");
const glob = require("glob");
const fs = require("fs");
const htmlMinifier = require("@minify-html/node");

const config = require("./jereko-hbs.config.cjs");

const outputDir = config?.distDir ?? "out";

const main = async () => {
  // Start the dev server
  await startDevServer();

  // Kill the process when Node.js exit
  process.on("exit", () => {
    console.log("closing resources!");
  });

  const routesDirGlob = glob.globSync("src/routes/**/*.hbs", {
    eager: true,
  });
  const apiRoutesDirGlob = glob.globSync("src/api/**/*.ts", {
    eager: true,
  });

  const allRoutesMerged = [...routesDirGlob, ...apiRoutesDirGlob];

  // create output directory if not present
  fs.mkdirSync(outputDir, { recursive: true });

  // generate static site

  for (const route of allRoutesMerged) {
    try {
      /** @type {string} */
      const pathName = route
        .replace("src/", "")
        .replace(".hbs", "")
        .replace(".ts", "")
        .replace("routes/", "");

      if (!pathName.includes("api")) {
        const fetchUrl = `http://localhost:3000/${pathName}`.replace(
          "/index",
          "",
        );
        console.log(fetchUrl);
        const pageResponse = await fetch(fetchUrl);
        const pageContent = await pageResponse.text();

        const minified = htmlMinifier.minify(Buffer.from(pageContent), {
          keep_closing_tags: true,
          keep_spaces_between_attributes: true,
          preserve_brace_template_syntax: true,
        });

        if (pathName.includes("/")) {
          // create inner directories if not present
          fs.mkdirSync(`${outputDir}/${pathName.replace("index", "")}`, {
            recursive: true,
          });
        }

        const fileName = `${pathName}.html`;
        fs.writeFileSync(`${outputDir}/${fileName}`, minified);
      } else {
        if (pathName.includes("/")) {
          // create inner directories if not present
          fs.mkdirSync(
            `out/${pathName.replace("index", "").split("/.")[0].replace("/.", "")}`,
            {
              recursive: true,
            },
          );
        }
        const fetchUrl = `http://localhost:3000/${pathName}`.replace(
          "/index.",
          ".",
        );
        const apiContent = await fetch(fetchUrl);
        const apiContentData = await apiContent.text();
        fs.writeFileSync(`${outputDir}/${pathName}`, String(apiContentData));
      }
    } catch (error) {
      console.error(error);
    }
  }

  try {
    // copy over assets from public into out
    const publicDirGlob = glob.globSync("public/**/*", {
      eager: true,
    });

    for (const publicDir of publicDirGlob) {
      const pathName = publicDir.replace("public/", "");

      fs.cpSync(publicDir, `${outputDir}/${pathName}`, {
        recursive: true,
      });
    }
  } catch (err) {
    console.error(error);
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
