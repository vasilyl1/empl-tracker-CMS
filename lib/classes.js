class department {
    constructor(dep_id, dep_name) {
      this.dep_id = dep_id;
      this.dep_name = dep_name;
    }
  
    printMetaData() {
      // console.log(`Created by ${this.authorName} on ${this.createdOn}`);
    }
  }
  
  class role extends department {
    constructor(dep_id, dep_name, title, salary, role_id) {
      super(dep_id, dep_name);
      this.title = title;
      this.salary = salary;
      this.role_id = role_id;
    }
  
    addComment(comment) {
      // this.comments.push(comment);
    }
  }

  class employee extends role {
    constructor(dep_id, dep_name, title, salary, role_id, 
        first_name, last_name, manager_id, empl_id) {
      super(dep_id, dep_name, title, salary, role_id);
      this.first_name = first_name;
      this.last_name = last_name;
      this.manager_id = manager_id;
      this.empl_id = empl_id;
    }
  
    addComment(comment) {
      // this.comments.push(comment);
    }
  }

  module.exports = {department,role,employee};