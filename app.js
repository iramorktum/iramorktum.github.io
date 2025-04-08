const { createApp } = Vue;

createApp({
  data() {
    return {
      about: [
        "Привет! Слева от вас — кот Тихий, а меня зовут Александра, и я занимаюсь веб-разработкой.",
        "Специализируюсь на создании самого различного толка веб-приложений с использованием Vue.js и перечисленных ниже других технологий. Балуюсь рисованием в цифре, но, кажется, эта страница посвящена не художествам.",
        "За моей спиной годы зависания в IDE, но свою активную деятельность я начала очень недавно."
      ],
      skills: [
        "JavaScript",
        "Vue.js",
        "HTML5",
        "CSS3",
        "Node.js",
        "Express",
        "Git",
        "PHP"
      ],
      socialLinks: [
        { name: "GitHub", url: "https://github.com/iramorktum" },
        { name: "Telegram", url: "https://t.me/iramorktum" }
      ],
      projectButtonText: "Лунный симулятор лазания",
      projectLink: "climbing",
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}).mount('#app');