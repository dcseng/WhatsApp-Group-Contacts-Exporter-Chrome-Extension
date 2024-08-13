class ContactFinder {
  #db;
  #chatToFind;
  #dbName = "model-storage";
  #chatsCol = "chat";
  #contactCol = "contact";
  #groupCol = "participant";

  constructor() {
    this.#chatToFind = this.#getGroupName();
  }

  #getGroupName() {
    const groupNameNode = document.evaluate(
      '/html/body/div[1]/div/div/div[2]/div[4]/div/header/div[2]/div[1]/div/span/text()',
      document,
      null,
      XPathResult.STRING_TYPE,
      null
    );
    return groupNameNode.stringValue || "Unknown Group";
  }

  async openConnection() {
    if (!this.#db) {
      const dbName = this.#dbName;
      this.#db = await new Promise((resolve, reject) => {
        let request = indexedDB.open(dbName);
        request.onerror = (event) => {
          reject(event);
        };
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }
    return this.#db;
  }

  async #promisifyCol(collection, query, count) {
    const db = await this.openConnection();
    return new Promise((resolve, reject) => {
      const request = db.transaction(collection).objectStore(collection).getAll(query, count);

      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }

  async #getChats() {
    const allChats = await this.#promisifyCol(this.#chatsCol);
    const chatToFind = this.#chatToFind;
    return allChats.filter((chat) => {
      return chat.name && chat.name.includes(chatToFind);
    });
  }

  async #getGroups() {
    const chats = (await this.#getChats()).map((chat) => chat.id);
    const allGroups = await this.#promisifyCol(this.#groupCol);

    return allGroups.filter((group) => {
      return group.groupId && chats.includes(group.groupId);
    });
  }

  async #getGroupParticipants() {
    const groups = await this.#getGroups();
    const map = new Map();

    groups.forEach((group) => {
      group.participants.forEach((par) => {
        const num = par.replace("@c.us", "");
        map.set(num, num);
      });
    });

    return map;
  }

  async #getContacts() {
    return this.#promisifyCol(this.#contactCol);
  }

  async getGroupMembers() {
    const members = await this.#getGroupParticipants();
    const contacts = await this.#getContacts();

    contacts.forEach((contact) => {
      var num;
      if (contact.phoneNumber) {
        num = contact.phoneNumber.split("@")[0];
      } else if (contact.id) {
        num = contact.id.split("@")[0];
      }
      if (num && members.get(num)) {
        members.set(num, {
          phoneNum: num,
          name: contact.name,
          pushname: contact.pushname,
        });
      }
    });
    return members;
  }

  async downloadMembersAsCSV() {
    const members = await this.getGroupMembers();
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += '"Phone";"Name";"Push Name";"Group Name"\r\n';

    for (const [key, value] of members.entries()) {
        const values = [
            value.phoneNum || "",
            value.name || "",
            value.pushname || "",
            this.#chatToFind || "" // Adiciona o nome do grupo como quarta coluna
        ];
        const row = values.map((value) => `"${value}"`).join(";");
        csvContent += row + "\r\n";
    }

    const encodedUri = encodeURI(csvContent);
    const fileName = `${this.#chatToFind}.csv`; // Define o nome do arquivo como o nome do grupo

    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // Necessário para FF
    link.click();
  }
}

(async () => {
  const contactFinder = new ContactFinder();
  await contactFinder.downloadMembersAsCSV();
})();
