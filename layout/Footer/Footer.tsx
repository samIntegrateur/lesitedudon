import React, { useEffect, useState } from "react";
import Container from '../Container/Container';
import classes from './Footer.module.css';

const Footer: React.FC = () => {

  const CREATION_DATE = 2020;

  const [copyrightDates, setCopyrightDates] = useState<string>(CREATION_DATE.toString());

  const getDates = (fromYear: number): string => {
    const now = new Date();
    const currentYear = now.getFullYear();
    if (currentYear === fromYear) {
      return fromYear.toString();
    }
    return `${fromYear} - ${currentYear}`;
  }

  useEffect(() => {
    const newCopyrightDates = getDates(CREATION_DATE);
    setCopyrightDates(newCopyrightDates);
  }, []);

  return (
    <footer className={classes.footer}>
      <Container>
        <p>
          LeSiteDuDon © {copyrightDates}
        </p>
      </Container>
    </footer>
  );

};

export default Footer;
