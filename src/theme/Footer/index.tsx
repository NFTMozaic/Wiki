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
            <span className="nfm-icon">𝕏</span> Twitter
          </Link>
          <Link className="nfm-footer__link" to="https://t.me/nft_moz_support" target="_blank">
            <svg className="nfm-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9.984 15.516l.234-3.234 6.422-5.625-7.031 4.219-2.906-.984zm11.016-13.031c.422 0 .75.141.984.375.234.234.375.563.375.984s-.094.844-.281 1.219l-3.563 13.313c-.188.703-.609 1.266-1.266 1.688-.609.375-1.266.469-1.922.281l-3.984-1.219-2.156 2.109c-.234.188-.469.281-.75.281-.281 0-.516-.094-.703-.281s-.281-.422-.281-.703v-3.469l10.406-9.656-12.328 7.5-3.328-1.031c-.656-.234-1.031-.703-1.078-1.406-.094-.703.234-1.219.938-1.5L20.438 2.53c.188-.094.375-.141.563-.141z"/></svg>
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
