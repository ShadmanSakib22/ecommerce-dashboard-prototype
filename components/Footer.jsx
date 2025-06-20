const Footer = () => {
  return (
    <footer className="border-t-8 border-double border-background p-4 text-center text-xs md:text-sm bg-primary text-primary-foreground">
      Copyright &copy; {new Date().getFullYear()}. All rights reserved. Made
      with ❤️ by{" "}
      <a
        href="https://shadman-portfolio-2024.vercel.app/"
        className="hover:underline underline-offset-4 text-nowrap"
      >
        Shadman Sakib
      </a>
    </footer>
  );
};

export default Footer;
