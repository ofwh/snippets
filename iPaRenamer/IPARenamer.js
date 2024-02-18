import fs from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import plist from 'plist';

const IPA_EXT_NAME = '.ipa';

class IPARenamer {
  constructor(opts = { dir: 'ipa', out: 'out' }) {
    this.dir = path.join(process.cwd(), opts.dir);
    this.out = path.join(process.cwd(), opts.out);
  }

  async run() {
    try {
      await fs.access(this.dir, fs.constants.F_OK);
      await fs.mkdir(this.out, { recursive: true });
    } catch (e) {
      console.log(`❌ ${e.message}`);
      process.exit(-1);
    }

    const { dir } = this;
    const files = await fs.readdir(dir);

    for (let file of files) {
      const filePath = `${dir}/${file}`;
      const stat = await fs.stat(filePath);
      const isDir = stat.isDirectory();

      if (!isDir && file.toLowerCase().endsWith(IPA_EXT_NAME)) {
        await this.rename(filePath);
      }
    }
  }

  async rename(from) {
    const fileName = path.basename(from, IPA_EXT_NAME);

    try {
      const zip = new AdmZip(from);
      const entries = zip.getEntries();

      for (let entry of entries) {
        const name = entry.entryName;

        // 文件路径格式如 Payload/xxxxx.app/Info.plist
        if (name.endsWith('/Info.plist') && name.split('/').length === 3) {
          const content = entry.getData().toString('utf-8');
          const xml = plist.parse(content) || {};
          const bundleName = xml.CFBundleIdentifier;

          if (!bundleName) {
            console.log('⚠️ CFBundleIdentifier not found!');
            return;
          }

          const targetFile = `${fileName}@${bundleName}${IPA_EXT_NAME}`;
          const toPath = `${this.out}/${targetFile}`;
          await fs.rename(from, toPath);
          console.log(`✅ Rename ${path.basename(from)} \t-->    ${targetFile}`);
        }
      }
    } catch (e) {
      console.log(`❌ Rename failure with error "${e.message}"`);
    }
  }
}

export default IPARenamer;