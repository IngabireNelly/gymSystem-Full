import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import {
  InstagramLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon } from
"@radix-ui/react-icons";
import { PillButton } from "./PillButton";
import { useAuth } from "../contexts/AuthContext";
import { navLinks } from "../data/content";
import { homeFor } from "../utils/auth";
import { scrollToSection } from "../utils/scroll";

const socials = [
{ label: "Instagram", Icon: InstagramLogoIcon, href: "https://instagram.com" },
{ label: "Twitter", Icon: TwitterLogoIcon, href: "https://twitter.com" },
{ label: "LinkedIn", Icon: LinkedInLogoIcon, href: "https://linkedin.com" }];


export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = useAuth();

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  }

  const actions = session ?
  <PillButton size="sm" to={homeFor(session.role)}>
      My Dashboard
    </PillButton> :

  <>
      <PillButton size="sm" variant="outline-dark" to="/login">
        Log In
      </PillButton>
      <PillButton size="sm" to="/apply">
        Apply for Membership
      </PillButton>
    </>;


  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 md:h-20 md:px-8">
        
        <a
          href="#home"
          onClick={(e) => go(e, "home")}
          className="font-display text-2xl uppercase tracking-wide text-ink">
          
          GymRental
        </a>

        <ul className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) =>
          <li key={link.id}>
              <a
              href={`#${link.id}`}
              onClick={(e) => go(e, link.id)}
              className="relative whitespace-nowrap py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/65 transition-colors duration-150 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-200 after:ease-snappy hover:text-ink hover:after:scale-x-100">
              
                {link.label}
              </a>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-4 2xl:flex">
            {socials.map(({ label, Icon, href }) =>
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-ink/60 transition-[color,transform] duration-150 hover:-translate-y-0.5 hover:text-ink">
              
                <Icon className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="hidden items-center gap-3 md:flex">{actions}</div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-full p-2 text-ink transition-transform duration-150 active:scale-90 xl:hidden">
            
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen &&
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="border-t border-ink/10 bg-paper px-5 pb-6 pt-4 xl:hidden">
          
            <ul className="flex flex-col">
              {navLinks.map((link) =>
            <li key={link.id}>
                  <a
                href={`#${link.id}`}
                onClick={(e) => go(e, link.id)}
                className="block border-b border-ink/10 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ink">
                
                    {link.label}
                  </a>
                </li>
            )}
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3 md:hidden">{actions}</div>
            <div className="mt-5 flex gap-4">
              {socials.map(({ label, Icon, href }) =>
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="text-ink/70">
                  <Icon className="h-4 w-4" />
                </a>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}