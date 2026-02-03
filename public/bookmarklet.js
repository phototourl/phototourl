(function(){
  // 获取当前域名
  var baseUrl = window.location.origin;
  var uploadUrl = baseUrl + '/api/upload';
  
  // 创建样式
  var style = document.createElement('style');
  style.textContent = `
    .ptu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    .ptu-modal {
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .ptu-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #1f2937;
    }
    .ptu-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
      max-height: 400px;
      overflow-y: auto;
    }
    .ptu-image-item {
      position: relative;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s;
    }
    .ptu-image-item:hover {
      border-color: #3b82f6;
      transform: scale(1.05);
    }
    .ptu-image-item.selected {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    }
    .ptu-image-item img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      display: block;
    }
    .ptu-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .ptu-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ptu-btn-primary {
      background: #3b82f6;
      color: white;
    }
    .ptu-btn-primary:hover {
      background: #2563eb;
    }
    .ptu-btn-secondary {
      background: #e5e7eb;
      color: #374151;
    }
    .ptu-btn-secondary:hover {
      background: #d1d5db;
    }
    .ptu-loading {
      text-align: center;
      padding: 20px;
      color: #6b7280;
    }
    .ptu-success {
      text-align: center;
      padding: 20px;
    }
    .ptu-success-title {
      font-size: 18px;
      font-weight: 600;
      color: #10b981;
      margin-bottom: 12px;
    }
    .ptu-url {
      background: #f3f4f6;
      padding: 12px;
      border-radius: 6px;
      word-break: break-all;
      font-family: monospace;
      font-size: 14px;
      margin-bottom: 12px;
      color: #1f2937;
    }
    .ptu-copy-btn {
      width: 100%;
      padding: 10px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .ptu-copy-btn:hover {
      background: #2563eb;
    }
    .ptu-copy-btn.copied {
      background: #10b981;
    }
    .ptu-error {
      color: #ef4444;
      text-align: center;
      padding: 20px;
    }
  `;
  document.head.appendChild(style);
  
  // 收集页面中的所有图片
  function collectImages() {
    var images = [];
    var imgElements = document.querySelectorAll('img');
    
    imgElements.forEach(function(img) {
      var src = img.src;
      // 过滤掉 data URI 和非常小的图片
      if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
        // 检查图片是否已加载
        if (img.complete && img.naturalWidth > 50 && img.naturalHeight > 50) {
          images.push({
            src: src,
            alt: img.alt || 'Image',
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        }
      }
    });
    
    return images;
  }
  
  // 上传图片
  function uploadImage(imageUrl, callback) {
    fetch(imageUrl)
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to fetch image');
        return response.blob();
      })
      .then(function(blob) {
        // 检查文件大小（10MB限制）
        if (blob.size > 10 * 1024 * 1024) {
          throw new Error('Image too large. Max 10MB.');
        }
        
        // 检查文件类型
        var type = blob.type;
        var allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(type)) {
          throw new Error('Unsupported file type. Use PNG, JPG, WEBP, or GIF.');
        }
        
        var formData = new FormData();
        formData.append('file', blob, 'image.' + type.split('/')[1]);
        
        return fetch(uploadUrl, {
          method: 'POST',
          body: formData
        });
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.error) {
          throw new Error(data.error);
        }
        callback(null, data.url);
      })
      .catch(function(error) {
        callback(error.message || 'Upload failed');
      });
  }
  
  // 复制到剪贴板
  function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  
  // 创建模态框
  function createModal() {
    var overlay = document.createElement('div');
    overlay.className = 'ptu-overlay';
    overlay.id = 'ptu-overlay';
    
    var images = collectImages();
    
    if (images.length === 0) {
      overlay.innerHTML = '<div class="ptu-modal"><div class="ptu-error">No images found on this page.</div><div class="ptu-buttons"><button class="ptu-btn ptu-btn-secondary" onclick="document.getElementById(\'ptu-overlay\').remove()">Close</button></div></div>';
      document.body.appendChild(overlay);
      return;
    }
    
    var selectedIndex = -1;
    var modalContent = '<div class="ptu-modal">';
    modalContent += '<div class="ptu-title">Select an image to upload</div>';
    modalContent += '<div class="ptu-images">';
    
    images.forEach(function(img, index) {
      modalContent += '<div class="ptu-image-item" data-index="' + index + '">';
      modalContent += '<img src="' + img.src + '" alt="' + img.alt + '" />';
      modalContent += '</div>';
    });
    
    modalContent += '</div>';
    modalContent += '<div class="ptu-buttons">';
    modalContent += '<button class="ptu-btn ptu-btn-secondary" onclick="document.getElementById(\'ptu-overlay\').remove()">Cancel</button>';
    modalContent += '<button class="ptu-btn ptu-btn-primary" id="ptu-upload-btn" disabled>Upload</button>';
    modalContent += '</div>';
    modalContent += '</div>';
    
    overlay.innerHTML = modalContent;
    document.body.appendChild(overlay);
    
    // 图片选择
    var imageItems = overlay.querySelectorAll('.ptu-image-item');
    imageItems.forEach(function(item) {
      item.addEventListener('click', function() {
        imageItems.forEach(function(i) { i.classList.remove('selected'); });
        item.classList.add('selected');
        selectedIndex = parseInt(item.getAttribute('data-index'));
        document.getElementById('ptu-upload-btn').disabled = false;
      });
    });
    
    // 上传按钮
    document.getElementById('ptu-upload-btn').addEventListener('click', function() {
      if (selectedIndex === -1) return;
      
      var selectedImage = images[selectedIndex];
      var btn = this;
      btn.disabled = true;
      btn.textContent = 'Uploading...';
      
      overlay.querySelector('.ptu-images').style.display = 'none';
      overlay.querySelector('.ptu-buttons').style.display = 'none';
      overlay.querySelector('.ptu-title').style.display = 'none';
      
      var loadingDiv = document.createElement('div');
      loadingDiv.className = 'ptu-loading';
      loadingDiv.textContent = 'Uploading image...';
      overlay.querySelector('.ptu-modal').appendChild(loadingDiv);
      
      uploadImage(selectedImage.src, function(error, url) {
        loadingDiv.remove();
        
        if (error) {
          var errorDiv = document.createElement('div');
          errorDiv.className = 'ptu-error';
          errorDiv.textContent = 'Error: ' + error;
          overlay.querySelector('.ptu-modal').appendChild(errorDiv);
          
          var closeBtn = document.createElement('button');
          closeBtn.className = 'ptu-btn ptu-btn-secondary';
          closeBtn.textContent = 'Close';
          closeBtn.onclick = function() { overlay.remove(); };
          overlay.querySelector('.ptu-modal').appendChild(closeBtn);
          return;
        }
        
        // 显示成功消息
        var successDiv = document.createElement('div');
        successDiv.className = 'ptu-success';
        successDiv.innerHTML = '<div class="ptu-success-title">✓ Upload Successful!</div>';
        successDiv.innerHTML += '<div class="ptu-url" id="ptu-url">' + url + '</div>';
        successDiv.innerHTML += '<button class="ptu-copy-btn" id="ptu-copy-btn">Copy URL</button>';
        overlay.querySelector('.ptu-modal').appendChild(successDiv);
        
        // 复制按钮
        var copyBtn = document.getElementById('ptu-copy-btn');
        copyBtn.addEventListener('click', function() {
          if (copyToClipboard(url)) {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(function() {
              copyBtn.textContent = 'Copy URL';
              copyBtn.classList.remove('copied');
            }, 2000);
          }
        });
        
        // 3秒后自动关闭
        setTimeout(function() {
          overlay.remove();
        }, 5000);
      });
    });
    
    // 点击外部关闭
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }
  
  // 如果已经存在，先移除
  var existing = document.getElementById('ptu-overlay');
  if (existing) {
    existing.remove();
  }
  
  // 创建模态框
  createModal();
})();
