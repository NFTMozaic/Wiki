import React from 'react';
import Link from '@docusaurus/Link';
import './styles.css';

export default function Footer() {
  return (
    <footer className="nfm-footer">
      <div className="nfm-footer__inner">
        <div className="nfm-footer__section nfm-footer__brand">
          <img src="/img/logo.svg" alt="NFTMozaic" className="nfm-footer__logo" />
          <p className="nfm-footer__tagline">Polkadot NFT Alliance</p>
        </div>

        <div className="nfm-footer__section">
          <h4 className="nfm-footer__title">Community</h4>
          <Link className="nfm-footer__link" to="https://x.com/nftmozaic" target="_blank">
          Twitter
          </Link>
          <Link className="nfm-footer__link" to="https://t.me/nft_moz_support" target="_blank">
          Telegram
          </Link>
        </div>

        <div className="nfm-footer__section">
          <h4 className="nfm-footer__title">More</h4>
          <Link className="nfm-footer__link" to="https://nftmozaic.com/blog" target="_blank">Blog</Link>
          <Link className="nfm-footer__link" to="https://github.com/nftmozaic" target="_blank">GitHub</Link>
        </div>
      </div>
      <div className="nfm-footer__bottom">
        © {new Date().getFullYear()} NFTMozaic. Built with Docusaurus.
      </div>
    </footer>
  );
}
